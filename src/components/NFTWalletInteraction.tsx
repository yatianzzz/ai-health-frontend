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
    const [selectedNftForDeposit, setSelectedNftForDeposit] = useState<string>('');
    const [selectedNftForReceive, setSelectedNftForReceive] = useState<string>('');
    const [selectedNftForTransfer, setSelectedNftForTransfer] = useState<string>('');
    const [transferAddress, setTransferAddress] = useState<string>('');
    const [onChainNfts, setOnChainNfts] = useState<string[]>([]);
    const [loading, setLoading] = useState({
        deposit: false,
        receive: false,
        transfer: false
    });

    // Get owned NFTs
    const ownedNfts = nfts.filter(nft => nft.isOwned);

    useEffect(() => {
        const fetchOnChainNfts = async () => {
            if (nftService && walletAddress) {
                try {
                    const onChainList = await nftService.getChainNFTs(walletAddress);
                    setOnChainNfts(onChainList);
                } catch (error) {
                    console.error('Failed to get on-chain NFTs:', error);
                }
            }
        };

        fetchOnChainNfts();
    }, [nftService, walletAddress]);

    const handleDepositToChain = async () => {
        if (!selectedNftForDeposit || !nftService || !walletAddress) return;

        setLoading(prev => ({ ...prev, deposit: true }));
        try {
            await nftService.depositNFTToChain(selectedNftForDeposit, walletAddress);
            message.success('NFT deposited to chain successfully!');
            setSelectedNftForDeposit('');
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to deposit NFT');
        } finally {
            setLoading(prev => ({ ...prev, deposit: false }));
        }
    };

    const handleReceiveFromChain = async () => {
        if (!selectedNftForReceive || !nftService || !walletAddress) return;

        setLoading(prev => ({ ...prev, receive: true }));
        try {
            await nftService.receiveNFTFromChain(selectedNftForReceive, walletAddress);
            message.success('NFT received successfully!');
            setSelectedNftForReceive('');
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to receive NFT');
        } finally {
            setLoading(prev => ({ ...prev, receive: false }));
        }
    };

    const handleTransferNft = async () => {
        if (!selectedNftForTransfer || !transferAddress || !nftService || !walletAddress) return;

        setLoading(prev => ({ ...prev, transfer: true }));
        try {
            await nftService.transferNFT(walletAddress, selectedNftForTransfer, transferAddress);
            message.success('NFT transferred successfully!');
            setSelectedNftForTransfer('');
            setTransferAddress('');
            onSuccess?.();
        } catch (error: any) {
            console.error('Transfer error:', error);
            message.error(error.message || 'Failed to transfer NFT');
        } finally {
            setLoading(prev => ({ ...prev, transfer: false }));
        }
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
                {/* Deposit to Chain */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <CloudUploadOutlined style={{ color: '#1890ff' }} />
                                Deposit to Chain
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Deposit your NFTs to the blockchain for secure storage and retrieval at any time
                        </Text>
                        
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Select NFT to Deposit:</Text>
                                <Select
                                    placeholder="Select an NFT"
                                    style={{ width: '100%', marginTop: 8 }}
                                    value={selectedNftForDeposit}
                                    onChange={setSelectedNftForDeposit}
                                >
                                    {ownedNfts.map(nft => (
                                        <Option key={nft.id} value={nft.id}>
                                            <Space>
                                                <Badge 
                                                    color={nft.category === 'discount' ? 'purple' : 'orange'} 
                                                    text={nft.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                                />
                                                {nft.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                            
                            <Button
                                type="primary"
                                icon={<CloudUploadOutlined />}
                                onClick={handleDepositToChain}
                                loading={loading.deposit}
                                disabled={!selectedNftForDeposit}
                                style={{ width: '100%' }}
                            >
                                Deposit to Chain
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* Receive from Chain */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <CloudDownloadOutlined style={{ color: '#52c41a' }} />
                                Receive from Chain
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Receive NFTs from blockchain to your local wallet
                        </Text>
                        
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Select On-Chain NFT:</Text>
                                <Select
                                    placeholder="Select an on-chain NFT"
                                    style={{ width: '100%', marginTop: 8 }}
                                    value={selectedNftForReceive}
                                    onChange={setSelectedNftForReceive}
                                >
                                    {onChainNfts.map(nftId => {
                                        const nftInfo = nfts.find(n => n.id === nftId);
                                        return (
                                            <Option key={nftId} value={nftId}>
                                                {nftInfo ? nftInfo.name : nftId}
                                            </Option>
                                        );
                                    })}
                                </Select>
                            </div>
                            
                            <Button
                                type="primary"
                                icon={<CloudDownloadOutlined />}
                                onClick={handleReceiveFromChain}
                                loading={loading.receive}
                                disabled={!selectedNftForReceive}
                                style={{ width: '100%', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                            >
                                Receive from Chain
                            </Button>
                        </Space>
                    </Card>
                </Col>

                {/* Transfer NFT */}
                <Col xs={24}>
                    <Card 
                        title={
                            <Space>
                                <SendOutlined style={{ color: '#faad14' }} />
                                Transfer NFT
                            </Space>
                        }
                    >
                        <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
                            Transfer your NFTs to other users
                        </Text>
                        
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Text strong>Select NFT to Transfer:</Text>
                                <Select
                                    placeholder="Select an NFT"
                                    style={{ width: '100%', marginTop: 8 }}
                                    value={selectedNftForTransfer}
                                    onChange={setSelectedNftForTransfer}
                                >
                                    {ownedNfts.map(nft => (
                                        <Option key={nft.id} value={nft.id}>
                                            <Space>
                                                <Badge 
                                                    color={nft.category === 'discount' ? 'purple' : 'orange'} 
                                                    text={nft.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                                />
                                                {nft.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                            
                            <Col xs={24} md={10}>
                                <Text strong>Recipient Address:</Text>
                                <Input
                                    placeholder="Enter recipient wallet address"
                                    style={{ marginTop: 8 }}
                                    value={transferAddress}
                                    onChange={(e) => setTransferAddress(e.target.value)}
                                />
                            </Col>
                            
                            <Col xs={24} md={6}>
                                <div style={{ paddingTop: 24 }}>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        onClick={handleTransferNft}
                                        loading={loading.transfer}
                                        disabled={!selectedNftForTransfer || !transferAddress}
                                        style={{ width: '100%', backgroundColor: '#faad14', borderColor: '#faad14' }}
                                    >
                                        Transfer
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>

                {/* Owned NFT List */}
                <Col xs={24}>
                    <Card 
                        title={
                            <Space>
                                <WalletOutlined style={{ color: '#722ed1' }} />
                                My NFT Collection
                            </Space>
                        }
                    >
                        {ownedNfts.length > 0 ? (
                            <List
                                dataSource={ownedNfts}
                                renderItem={nft => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={nft.name}
                                            description={nft.description}
                                        />
                                        <div>
                                            <Badge 
                                                color={nft.category === 'discount' ? 'purple' : 'orange'} 
                                                text={nft.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                            />
                                        </div>
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Text type="secondary">No NFTs owned yet</Text>
                        )}
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Card size="small" style={{ marginTop: 16 }}>
                <Space direction="vertical" size={8}>
                    <Text strong>💡 Usage Instructions:</Text>
                    <Text>• <strong>Deposit to Chain</strong>: Securely store NFTs on the blockchain for better security</Text>
                    <Text>• <strong>Receive from Chain</strong>: Receive NFTs from the blockchain to your local wallet</Text>
                    <Text>• <strong>Transfer NFT</strong>: Transfer your NFTs to other users</Text>
                    <Text type="secondary">⚠️ Please ensure the recipient address is correct, transfer operations cannot be undone</Text>
                </Space>
            </Card>
        </div>
    );
}; 