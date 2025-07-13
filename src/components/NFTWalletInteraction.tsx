import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, message, Select, Input, List, Badge, Divider, Alert } from 'antd';
import { 
    CloudUploadOutlined, 
    CloudDownloadOutlined, 
    SendOutlined, 
    WalletOutlined,
    InfoCircleOutlined 
} from '@ant-design/icons';
import { NFT, NFTService } from '../services/nftService';

const { Title, Text } = Typography;
const { Option } = Select;

interface NFTWalletInteractionProps {
    nfts: NFT[];
    nftService?: NFTService;
    walletAddress?: string;
    onSuccess?: () => void;
}

export const NFTWalletInteraction: React.FC<NFTWalletInteractionProps> = ({ 
    nfts, 
    nftService, 
    walletAddress,
    onSuccess
}) => {
    const [selectedNFT, setSelectedNFT] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [chainNFTs, setChainNFTs] = useState<string[]>([]);

    // 获取用户拥有的NFT
    const ownedNFTs = nfts.filter(nft => nft.isOwned);

    useEffect(() => {
        if (nftService && walletAddress) {
            fetchChainNFTs();
        }
    }, [nftService, walletAddress]);

    const fetchChainNFTs = async () => {
        if (!nftService || !walletAddress) return;

        try {
            const chainNFTIds = await nftService.getChainNFTs(walletAddress);
            setChainNFTs(chainNFTIds);
        } catch (error) {
            console.error('获取链上NFT失败:', error);
        }
    };

    const handleDepositNFT = async (nftId: string) => {
        if (!nftService || !walletAddress) {
            message.error('Wallet not connected or service unavailable');
            return;
        }

        setLoading(prev => ({ ...prev, [`deposit_${nftId}`]: true }));
        try {
            await nftService.depositNFTToChain(nftId, walletAddress);
            message.success('NFT deposited to blockchain successfully!');
            await fetchChainNFTs();
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to deposit NFT');
        } finally {
            setLoading(prev => ({ ...prev, [`deposit_${nftId}`]: false }));
        }
    };

    const handleReceiveNFT = async (nftId: string) => {
        if (!nftService || !walletAddress) {
            message.error('Wallet not connected or service unavailable');
            return;
        }

        setLoading(prev => ({ ...prev, [`receive_${nftId}`]: true }));
        try {
            await nftService.receiveNFTFromChain(nftId, walletAddress);
            message.success('NFT received from blockchain successfully!');
            await fetchChainNFTs();
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to receive NFT');
        } finally {
            setLoading(prev => ({ ...prev, [`receive_${nftId}`]: false }));
        }
    };

    const handleTransferNFT = async () => {
        if (!selectedNFT || !recipientAddress) {
            message.error('Please select an NFT and enter a recipient address');
            return;
        }

        if (!nftService || !walletAddress) {
            message.error('Wallet not connected or service unavailable');
            return;
        }

        setLoading(prev => ({ ...prev, [`transfer_${selectedNFT}`]: true }));
        try {
            await nftService.transferNFT(selectedNFT, walletAddress, recipientAddress);
            message.success('NFT transferred successfully!');
            setSelectedNFT('');
            setRecipientAddress('');
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to transfer NFT');
        } finally {
            setLoading(prev => ({ ...prev, [`transfer_${selectedNFT}`]: false }));
        }
    };

    const getNFTName = (nftId: string): string => {
        const nft = nfts.find(n => n.id === nftId);
        return nft ? nft.name : nftId;
    };

    const getNFTImage = (nftId: string): string => {
        const nft = nfts.find(n => n.id === nftId);
        return nft ? nft.frontImage : '';
    };

    if (!walletAddress) {
        return (
            <Alert
                message="Please connect wallet first"
                description="You need to connect your wallet to perform NFT interaction operations"
                type="warning"
                showIcon
            />
        );
    }

    return (
        <div style={{ padding: '0 24px' }}>
            <Row gutter={[24, 24]}>
                {/* 存入链上 */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <CloudUploadOutlined style={{ color: '#1890ff' }} />
                                Deposit to Blockchain
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Deposit your NFTs to the blockchain for secure storage and withdrawal at any time
                        </Text>
                        
                        {ownedNFTs.length > 0 ? (
                            <List
                                size="small"
                                dataSource={ownedNFTs}
                                renderItem={(nft) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                key="deposit"
                                                type="primary"
                                                size="small"
                                                icon={<CloudUploadOutlined />}
                                                loading={loading[`deposit_${nft.id}`]}
                                                onClick={() => handleDepositNFT(nft.id)}
                                            >
                                                Deposit
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <img 
                                                    src={nft.frontImage} 
                                                    alt={nft.name}
                                                    style={{ width: 40, height: 40, borderRadius: 8 }}
                                                />
                                            }
                                            title={nft.name}
                                            description={
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {nft.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                                </Text>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                                <InfoCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                                <div>No NFTs to deposit</div>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* 从链上接收 */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <CloudDownloadOutlined style={{ color: '#52c41a' }} />
                                Receive from Blockchain
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Receive NFTs from the blockchain to your local collection
                        </Text>
                        
                        {chainNFTs.length > 0 ? (
                            <List
                                size="small"
                                dataSource={chainNFTs}
                                renderItem={(nftId) => {
                                    const nft = nfts.find(n => n.id === nftId);
                                    return (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    key="receive"
                                                    type="primary"
                                                    size="small"
                                                    icon={<CloudDownloadOutlined />}
                                                    loading={loading[`receive_${nftId}`]}
                                                    onClick={() => handleReceiveNFT(nftId)}
                                                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                                >
                                                    Receive
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <img 
                                                        src={nft?.frontImage} 
                                                        alt={nft?.name}
                                                        style={{ width: 40, height: 40, borderRadius: 8 }}
                                                    />
                                                }
                                                title={nft?.name || nftId}
                                                description={
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        On Blockchain
                                                    </Text>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
                                <InfoCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                                <div>No NFTs on blockchain</div>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* 转移NFT */}
                <Col xs={24} style={{ marginTop: 24 }}>
                    <Card 
                        title={
                            <Space>
                                <SendOutlined style={{ color: '#722ed1' }} />
                                Transfer NFT
                            </Space>
                        }
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Transfer your NFTs to another wallet address
                        </Text>
                        
                        <Row gutter={16}>
                            <Col span={8}>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Select NFT:</Text>
                                    <Select
                                        style={{ width: '100%', marginTop: 8 }}
                                        placeholder="Choose NFT to transfer"
                                        value={selectedNFT}
                                        onChange={setSelectedNFT}
                                    >
                                        {ownedNFTs.map(nft => (
                                            <Option key={nft.id} value={nft.id}>
                                                {nft.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 16 }}>
                                    <Text strong>Recipient Address:</Text>
                                    <Input
                                        style={{ marginTop: 8 }}
                                        placeholder="Enter recipient wallet address"
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                        prefix={<WalletOutlined />}
                                    />
                                </div>
                            </Col>
                            <Col span={4}>
                                <div style={{ marginTop: 24 }}>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        loading={loading[`transfer_${selectedNFT}`]}
                                        onClick={handleTransferNFT}
                                        disabled={!selectedNFT || !recipientAddress}
                                        style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                                        block
                                    >
                                        Transfer
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* 帮助信息 */}
            <Card size="small" style={{ marginTop: 16 }}>
                <Space direction="vertical" size={8}>
                    <Text strong>💡 Usage Instructions:</Text>
                    <Text>• <strong>Deposit to Blockchain</strong>: Securely store your NFTs on the blockchain for better security</Text>
                    <Text>• <strong>Receive from Blockchain</strong>: Receive NFTs from the blockchain to your local collection</Text>
                    <Text>• <strong>Transfer NFT</strong>: Transfer your NFTs to another wallet address</Text>
                    <Text type="secondary">⚠️ Please ensure the recipient address is correct, and transfer operations cannot be undone</Text>
                </Space>
            </Card>
        </div>
    );
}; 