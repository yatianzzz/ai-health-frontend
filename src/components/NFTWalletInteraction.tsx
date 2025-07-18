import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Button, Typography, Space, message, Select, Input, List, Badge, Divider, Alert } from 'antd';
import { 
    CloudUploadOutlined, 
    CloudDownloadOutlined, 
    SendOutlined, 
    WalletOutlined,
    InfoCircleOutlined 
} from '@ant-design/icons';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { NFT } from '../services/nftService';
import { RealNFTService } from '../services/realNftService';

const { Title, Text } = Typography;
const { Option } = Select;

interface NFTWalletInteractionProps {
    nfts: NFT[];
    onSuccess?: () => void;
}

export const NFTWalletInteraction: React.FC<NFTWalletInteractionProps> = ({ 
    nfts, 
    onSuccess
}) => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();
    
    const [selectedNFT, setSelectedNFT] = useState<string>('');
    const [recipientAddress, setRecipientAddress] = useState<string>('');
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
    const [chainNFTs, setChainNFTs] = useState<string[]>([]);

    // 创建真实的NFT服务实例
    const realNftService = useMemo(() => {
        if (connected && connection && wallet) {
            return new RealNFTService(connection, wallet);
        }
        return null;
    }, [connected, connection, wallet]);

    // 获取用户拥有的NFT
    const ownedNFTs = nfts.filter(nft => nft.isOwned);

    useEffect(() => {
        if (realNftService && connected && publicKey) {
            fetchChainNFTs();
        }
    }, [realNftService, connected, publicKey]);

    const fetchChainNFTs = async () => {
        if (!realNftService || !publicKey) return;

        try {
            const chainNFTIds = await realNftService.getChainNFTs(publicKey.toString());
            setChainNFTs(chainNFTIds);
        } catch (error) {
            console.error('Failed to fetch on-chain NFTs:', error);
            message.error('Failed to fetch on-chain NFTs');
        }
    };

    const handleDepositNFT = async (nftId: string) => {
        if (!realNftService || !publicKey) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, [`deposit_${nftId}`]: true }));
        try {
            await realNftService.depositNFTToChain(nftId, publicKey.toString());
            message.success('NFT successfully deposited to chain!');
            await fetchChainNFTs();
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to deposit NFT');
        } finally {
            setLoading(prev => ({ ...prev, [`deposit_${nftId}`]: false }));
        }
    };

    const handleReceiveNFT = async (nftId: string) => {
        if (!realNftService || !publicKey) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, [`receive_${nftId}`]: true }));
        try {
            await realNftService.receiveNFTFromChain(nftId, publicKey.toString());
            message.success('NFT successfully received from chain!');
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
            message.error('Please select NFT and enter recipient address');
            return;
        }

        if (!realNftService || !publicKey) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, [`transfer_${selectedNFT}`]: true }));
        try {
            await realNftService.transferNFT(selectedNFT, publicKey.toString(), recipientAddress);
            message.success('NFT transfer successful!');
            setSelectedNFT('');
            setRecipientAddress('');
            onSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to transfer NFT');
        } finally {
            setLoading(prev => ({ ...prev, [`transfer_${selectedNFT}`]: false }));
        }
    };

    const handleInitializeUserRecord = async () => {
        if (!realNftService) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, 'initialize': true }));
        try {
            await realNftService.initializeUserRecord();
            message.success('User record initialized successfully!');
        } catch (error: any) {
            message.error(error.message || 'Failed to initialize user record');
        } finally {
            setLoading(prev => ({ ...prev, 'initialize': false }));
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

    if (!connected) {
        return (
            <Alert
                message="Please connect your wallet first"
                description="You need to connect your Solana wallet to perform NFT on-chain interaction operations"
                type="warning"
                showIcon
            />
        );
    }

    return (
        <div style={{ padding: '0 24px' }}>
            {/* User record initialization */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Title level={4}>
                                <InfoCircleOutlined /> Initialize Account
                            </Title>
                            <Text type="secondary">
                                When using NFT features for the first time, you need to initialize your on-chain account records
                            </Text>
                            <Button 
                                type="primary" 
                                onClick={handleInitializeUserRecord}
                                loading={loading['initialize']}
                                icon={<WalletOutlined />}
                            >
                                Initialize User Record
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Deposit to chain */}
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
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Text type="secondary">
                                Deposit your owned NFTs to Solana on-chain wallet
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
                                                    disabled={chainNFTs.includes(nft.id)}
                                                >
                                                    {chainNFTs.includes(nft.id) ? 'Already on Chain' : 'Deposit to Chain'}
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <img 
                                                        src={nft.frontImage} 
                                                        alt={nft.name} 
                                                        style={{ width: 40, height: 40 }} 
                                                    />
                                                }
                                                title={nft.name}
                                                description={
                                                    <Badge 
                                                        status={chainNFTs.includes(nft.id) ? 'success' : 'default'}
                                                        text={chainNFTs.includes(nft.id) ? 'On Chain' : 'Local'}
                                                    />
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Text type="secondary">You don't own any NFTs yet</Text>
                            )}
                        </Space>
                    </Card>
                </Col>

                {/* Receive from chain */}
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
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Text type="secondary">
                                Receive NFTs from Solana chain to local wallet
                            </Text>
                            {chainNFTs.length > 0 ? (
                                <List
                                    size="small"
                                    dataSource={chainNFTs}
                                    renderItem={(nftId) => (
                                        <List.Item
                                            actions={[
                                                <Button
                                                    key="receive"
                                                    type="primary"
                                                    size="small"
                                                    icon={<CloudDownloadOutlined />}
                                                    loading={loading[`receive_${nftId}`]}
                                                    onClick={() => handleReceiveNFT(nftId)}
                                                >
                                                    Receive to Local
                                                </Button>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <img 
                                                        src={getNFTImage(nftId)} 
                                                        alt={getNFTName(nftId)} 
                                                        style={{ width: 40, height: 40 }} 
                                                    />
                                                }
                                                title={getNFTName(nftId)}
                                                description={
                                                    <Badge 
                                                        status="success" 
                                                        text="On Chain"
                                                    />
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <Text type="secondary">No NFTs on chain</Text>
                            )}
                        </Space>
                    </Card>
                </Col>

                {/* NFT Transfer */}
                <Col span={24}>
                    <Card 
                        title={
                            <Space>
                                <SendOutlined style={{ color: '#722ed1' }} />
                                Transfer NFT
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Text type="secondary">
                                Transfer NFT to other users
                            </Text>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Select
                                        placeholder="Select NFT to transfer"
                                        value={selectedNFT}
                                        onChange={setSelectedNFT}
                                        style={{ width: '100%' }}
                                    >
                                        {ownedNFTs.map(nft => (
                                            <Option key={nft.id} value={nft.id}>
                                                {nft.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={10}>
                                    <Input
                                        placeholder="Enter recipient's wallet address"
                                        value={recipientAddress}
                                        onChange={(e) => setRecipientAddress(e.target.value)}
                                    />
                                </Col>
                                <Col span={6}>
                                    <Button
                                        type="primary"
                                        icon={<SendOutlined />}
                                        loading={loading[`transfer_${selectedNFT}`]}
                                        onClick={handleTransferNFT}
                                        disabled={!selectedNFT || !recipientAddress}
                                        style={{ width: '100%' }}
                                    >
                                        Transfer NFT
                                    </Button>
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>
            </Row>

            <Divider />

            {/* Wallet information */}
            <Row>
                <Col span={24}>
                    <Card size="small">
                        <Space>
                            <WalletOutlined />
                            <Text strong>Wallet Address:</Text>
                            <Text code>{publicKey?.toString()}</Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}; 