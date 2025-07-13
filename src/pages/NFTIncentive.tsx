import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Button, Space, Tabs, Alert, Spin } from 'antd';
import { WalletOutlined, GiftOutlined, StarOutlined, PercentageOutlined, SwapOutlined } from '@ant-design/icons';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { SOLANA_RPC_ENDPOINT, SUPPORTED_WALLETS } from '../config/wallet';
import { NFTGallery } from '../components/NFTGallery';
import { NFTWalletInteraction } from '../components/NFTWalletInteraction';
import { WalletConnect } from '../components/WalletConnect';
import { NFT, NFTService, availableNFTs } from '../services/nftService';
import { getNFTProgram } from '../contracts/nft';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../layouts/DashboardLayout';

const { Title, Text, Paragraph } = Typography;

require('@solana/wallet-adapter-react-ui/styles.css');

// NFT页面的核心组件
const NFTIncentiveCore: React.FC = () => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const { token, username } = useAuth();
    const { userProfile } = useUser();
    const [currentCategory, setCurrentCategory] = useState('all');
    const [nfts, setNfts] = useState<NFT[]>(availableNFTs);
    const [isLoading, setIsLoading] = useState(false);
    const [nftService, setNftService] = useState<NFTService | null>(null);

    useEffect(() => {
        if (connected && publicKey) {
            try {
                const provider = new AnchorProvider(connection, (window as any).solana, {});
                const program = getNFTProgram(provider);
                const service = new NFTService(connection, program, provider);
                setNftService(service);
                fetchNFTs();
            } catch (error: any) {
                console.error('Error initializing NFT service:', error);
                // 使用本地数据
                setNfts(availableNFTs);
            }
        } else {
            setNfts(availableNFTs);
        }
    }, [connected, publicKey, connection]);

    const fetchNFTs = async () => {
        if (!publicKey || !nftService) return;

        setIsLoading(true);
        try {
            const allNFTs = await nftService.getAllNFTsWithOwnership(publicKey.toString());
            setNfts(allNFTs);
        } catch (error: any) {
            console.error('Error fetching NFTs:', error);
            setNfts(availableNFTs);
        } finally {
            setIsLoading(false);
        }
    };

    const getCategoryTitle = () => {
        switch (currentCategory) {
            case 'all':
                return 'All NFTs - Complete Collection';
            case 'owned':
                return 'Activated Benefits - Your Achievements';
            case 'unowned':
                return 'Locked Benefits - Available to Earn';
            default:
                return 'NFT Collection';
        }
    };

    const tabItems = [
        {
            key: 'gallery',
            label: (
                <Space>
                    <GiftOutlined />
                    NFT Gallery
                </Space>
            ),
            children: (
                <NFTGallery
                    nfts={nfts}
                    category={currentCategory}
                    nftService={nftService || undefined}
                    walletAddress={publicKey?.toString()}
                    onNFTMinted={fetchNFTs}
                />
            )
        },
        {
            key: 'wallet',
            label: (
                <Space>
                    <SwapOutlined />
                    Wallet Interaction
                </Space>
            ),
            children: (
                <NFTWalletInteraction
                    nfts={nfts}
                    nftService={nftService || undefined}
                    walletAddress={publicKey?.toString()}
                    onSuccess={fetchNFTs}
                />
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* 页面头部 */}
            <Card style={{ marginBottom: 24 }}>
                <Row justify="space-between" align="middle">
                    <Col span={16}>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            🎁 NFT Incentive Program
                        </Title>
                        <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                            Complete health challenges to earn exclusive NFT benefit cards and unlock more rewards and achievements!
                        </Paragraph>
                    </Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                        <WalletConnect />
                    </Col>
                </Row>
            </Card>

            {/* User Info Card */}
            {connected && publicKey && (
                <Card style={{ marginBottom: 24 }}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <Space>
                                <WalletOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                                <div>
                                    <Text strong>Connected Wallet</Text>
                                    <br />
                                    <Text code>{publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}</Text>
                                </div>
                            </Space>
                        </Col>
                        <Col span={8}>
                            <Space>
                                <GiftOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                                <div>
                                    <Text strong>Owned NFTs</Text>
                                    <br />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#722ed1' }}>
                                        {nfts.filter(nft => nft.isOwned).length} / {nfts.length}
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                        <Col span={8}>
                            <Space>
                                <StarOutlined style={{ fontSize: 24, color: '#faad14' }} />
                                <div>
                                    <Text strong>Eligible to Claim</Text>
                                    <br />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#faad14' }}>
                                        {nfts.filter(nft => nft.isEligible && !nft.isOwned).length}
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Feature Description Card */}
            <Card style={{ marginBottom: 24 }}>
                <Title level={4}>How NFT Incentives Work</Title>
                <Row gutter={16}>
                    <Col span={8}>
                        <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                            <PercentageOutlined style={{ fontSize: 48, color: '#722ed1' }} />
                            <Title level={5}>Discount Benefits</Title>
                            <Text type="secondary">
                                Complete health records to earn discount cards for platform purchases
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                            <StarOutlined style={{ fontSize: 48, color: '#faad14' }} />
                            <Title level={5}>Achievement Certificates</Title>
                            <Text type="secondary">
                                Earn prestigious titles by mastering diet or exercise habits
                            </Text>
                        </Space>
                    </Col>
                    <Col span={8}>
                        <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                            <WalletOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                            <Title level={5}>Blockchain Storage</Title>
                            <Text type="secondary">
                                Store your NFTs securely on the blockchain for permanent ownership
                            </Text>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Connection Status */}
            {!connected && (
                <Alert
                    message="Wallet Not Connected"
                    description="Please connect your wallet to view and manage your NFTs."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Loading State */}
            {isLoading && (
                <Card style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>
                        <Text>Loading NFT data...</Text>
                    </div>
                </Card>
            )}

            {/* Category Tabs and Content */}
            {!isLoading && (
                <Card>
                    <div style={{ marginBottom: 16 }}>
                        <Title level={4}>{getCategoryTitle()}</Title>
                        <Space>
                            <Button 
                                type={currentCategory === 'all' ? 'primary' : 'default'}
                                onClick={() => setCurrentCategory('all')}
                            >
                                All ({nfts.length})
                            </Button>
                            <Button 
                                type={currentCategory === 'owned' ? 'primary' : 'default'}
                                onClick={() => setCurrentCategory('owned')}
                            >
                                Owned ({nfts.filter(nft => nft.isOwned).length})
                            </Button>
                            <Button 
                                type={currentCategory === 'unowned' ? 'primary' : 'default'}
                                onClick={() => setCurrentCategory('unowned')}
                            >
                                Available ({nfts.filter(nft => !nft.isOwned).length})
                            </Button>
                        </Space>
                    </div>
                    
                    <Tabs defaultActiveKey="gallery" items={tabItems} />
                </Card>
            )}
        </div>
    );
};

// 主NFT页面组件，带有钱包提供者
const NFTIncentive: React.FC = () => {
    return (
        <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
            <WalletProvider wallets={SUPPORTED_WALLETS} autoConnect>
                <WalletModalProvider>
                    <NFTIncentiveCore />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// 带有布局的NFT页面
const NFTIncentiveWithLayout: React.FC = () => {
    return (
        <DashboardLayout>
            <NFTIncentive />
        </DashboardLayout>
    );
};

export default NFTIncentiveWithLayout; 