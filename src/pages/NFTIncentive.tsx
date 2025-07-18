import React, { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Typography, Tabs, Space, Button, message, Spin, Alert } from 'antd';
import { GiftOutlined, WalletOutlined, TrophyOutlined, InteractionOutlined } from '@ant-design/icons';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import DashboardLayout from '../layouts/DashboardLayout';
import { NFTGallery } from '../components/NFTGallery';
import { NFTWalletInteraction } from '../components/NFTWalletInteraction';
import { WalletConnect } from '../components/WalletConnect';
import { NFTService, NFT } from '../services/nftService';
import { RealNFTService } from '../services/realNftService';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const NFTIncentiveCore: React.FC = () => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const wallet = useWallet();
    
    const [loading, setLoading] = useState(false);
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [category, setCategory] = useState<string>('all');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // 创建NFT服务实例
    const nftService = useMemo(() => {
        return new NFTService(connection, {} as any, {} as any);
    }, [connection]);

    // 创建真实NFT服务实例
    const realNftService = useMemo(() => {
        if (connected && connection && wallet) {
            return new RealNFTService(connection, wallet);
        }
        return null;
    }, [connected, connection, wallet]);

    useEffect(() => {
        if (connected && publicKey) {
            fetchNFTs();
        }
    }, [connected, publicKey, refreshTrigger]);

    const fetchNFTs = async () => {
        if (!connected || !publicKey) return;
        
        setLoading(true);
        try {
            let nftList: NFT[] = [];
            
            if (realNftService) {
                // 使用真实NFT服务
                nftList = await realNftService.getAllNFTsWithOwnership(publicKey.toString());
            } else {
                // 回退到模拟NFT服务
                nftList = await nftService.getAllNFTsWithOwnership(publicKey.toString());
            }
            
            setNfts(nftList);
        } catch (error: any) {
            console.error('Error fetching NFTs:', error);
            message.error('Failed to fetch NFT data');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const getTabTitle = (category: string) => {
        switch (category) {
            case 'all': return 'All NFTs';
            case 'owned': return 'Owned';
            case 'available': return 'Available';
            case 'wallet': return 'Wallet Interaction';
            default: return 'All NFTs';
        }
    };

    const filteredNFTs = useMemo(() => {
        if (!realNftService) return nfts;
        return realNftService.filterNFTsByCategory(nfts, category);
    }, [nfts, category, realNftService]);

    if (!connected) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <WalletOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
                <Title level={3}>Connect Wallet to Start Using NFT Features</Title>
                <Text type="secondary" style={{ color: '#666', marginBottom: 32 }}>
                    Please connect your Solana wallet to obtain and manage health NFTs
                </Text>
                <WalletConnect />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Card>
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            <div style={{ textAlign: 'center' }}>
                                <TrophyOutlined style={{ fontSize: 48, color: '#f5222d', marginBottom: 16 }} />
                                <Title level={2}>Health NFT Incentive System</Title>
                                <Text type="secondary">
                                    Complete health records and earn exclusive NFT rewards! Real NFT system based on Solana blockchain
                                </Text>
                            </div>
                            
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Space>
                                        <WalletOutlined />
                                        <Text strong>Wallet Address:</Text>
                                        <Text code>{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</Text>
                                    </Space>
                                </Col>
                                <Col>
                                    <Space>
                                        <Button 
                                            type="primary" 
                                            onClick={handleRefresh}
                                            loading={loading}
                                        >
                                            Refresh Data
                                        </Button>
                                        <WalletConnect />
                                    </Space>
                                </Col>
                            </Row>
                        </Space>
                    </Card>
                </Col>

                <Col span={24}>
                    <Card>
                        <Tabs 
                            activeKey={category} 
                            onChange={setCategory}
                            type="card"
                            size="large"
                        >
                            <TabPane 
                                tab={<Space><GiftOutlined />All NFTs</Space>} 
                                key="all"
                            >
                                <Spin spinning={loading}>
                                    <NFTGallery
                                        nfts={filteredNFTs}
                                        category={category}
                                        nftService={realNftService}
                                        walletAddress={publicKey?.toString()}
                                        onNFTMinted={handleRefresh}
                                    />
                                </Spin>
                            </TabPane>

                            <TabPane 
                                tab={<Space><TrophyOutlined />Owned</Space>} 
                                key="owned"
                            >
                                <Spin spinning={loading}>
                                    <NFTGallery
                                        nfts={filteredNFTs}
                                        category={category}
                                        nftService={realNftService}
                                        walletAddress={publicKey?.toString()}
                                        onNFTMinted={handleRefresh}
                                    />
                                </Spin>
                            </TabPane>

                            <TabPane 
                                tab={<Space><GiftOutlined />Available</Space>} 
                                key="available"
                            >
                                <Spin spinning={loading}>
                                    <NFTGallery
                                        nfts={filteredNFTs}
                                        category={category}
                                        nftService={realNftService}
                                        walletAddress={publicKey?.toString()}
                                        onNFTMinted={handleRefresh}
                                    />
                                </Spin>
                            </TabPane>

                            <TabPane 
                                tab={<Space><InteractionOutlined />Wallet Interaction</Space>} 
                                key="wallet"
                            >
                                <NFTWalletInteraction
                                    nfts={nfts}
                                    onSuccess={handleRefresh}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>

            {/* Usage Instructions */}
            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card size="small">
                        <Space direction="vertical" size={8}>
                            <Text strong>💡 Usage Instructions:</Text>
                            <Text>• <strong>All NFTs</strong>: View all available NFTs and current progress</Text>
                            <Text>• <strong>Owned</strong>: View your owned NFT collection</Text>
                            <Text>• <strong>Available</strong>: View available NFTs and progress</Text>
                            <Text>• <strong>Wallet Interaction</strong>: Dedicated wallet function module, supports NFT on-chain, off-chain, transfer operations</Text>
                            <Text type="secondary">⚠️ This is a real NFT system based on Solana blockchain, please ensure wallet security</Text>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

// 不需要钱包连接的组件包装
const NFTIncentive: React.FC = () => {
    return <NFTIncentiveCore />;
};

// 带布局的组件包装
const NFTIncentiveWithLayout: React.FC = () => {
    return (
        <DashboardLayout>
            <NFTIncentive />
        </DashboardLayout>
    );
};

export default NFTIncentiveWithLayout; 