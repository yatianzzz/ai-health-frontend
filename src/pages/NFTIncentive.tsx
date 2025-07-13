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

// NFT Incentive page core component
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
                // Use local data
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
                return 'All NFTs';
            case 'owned':
                return 'Activated Benefits';
            case 'unowned':
                return 'Locked Benefits';
            default:
                return 'NFT Collection';
        }
    };

    const tabItems = [
        {
            key: 'all',
            label: (
                <Space>
                    <StarOutlined />
                    All NFTs
                </Space>
            ),
            children: (
                <NFTGallery
                    nfts={nfts}
                    category="all"
                    nftService={nftService || undefined}
                    walletAddress={publicKey?.toString()}
                    onNFTMinted={fetchNFTs}
                />
            )
        },
        {
            key: 'owned',
            label: (
                <Space>
                    <GiftOutlined />
                    Owned
                </Space>
            ),
            children: (
                <NFTGallery
                    nfts={nfts}
                    category="owned"
                    nftService={nftService || undefined}
                    walletAddress={publicKey?.toString()}
                    onNFTMinted={fetchNFTs}
                />
            )
        },
        {
            key: 'unowned',
            label: (
                <Space>
                    <PercentageOutlined />
                    Not Owned
                </Space>
            ),
            children: (
                <NFTGallery
                    nfts={nfts}
                    category="unowned"
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
            {/* Page Header */}
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
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <div>
                            <Text type="secondary">Logged User</Text>
                            <Title level={4} style={{ margin: '4px 0' }}>
                                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : username}
                            </Title>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <Text type="secondary">Wallet Status</Text>
                            <Title level={4} style={{ margin: '4px 0' }}>
                                {connected 
                                    ? `${publicKey?.toString().slice(0, 8)}...${publicKey?.toString().slice(-8)}`
                                    : 'Wallet Not Connected'
                                }
                            </Title>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Alert */}
            {!connected && (
                <Alert
                    message="Connect Wallet for Full Experience"
                    description="Connect your Solana wallet to view owned NFTs and earn new incentive benefits."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* NFT Display Area */}
            <Card>
                <Tabs
                    activeKey={currentCategory}
                    onChange={setCurrentCategory}
                    items={tabItems}
                    size="large"
                />
            </Card>

            {/* Loading State */}
            {isLoading && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin size="large" />
                    <Text style={{ display: 'block', marginTop: 16 }}>
                        Loading your NFT collection...
                    </Text>
                </div>
            )}
        </div>
    );
};

// Main NFT page component with wallet provider
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

// NFT page with layout
const NFTIncentiveWithLayout: React.FC = () => {
    return (
        <DashboardLayout>
            <NFTIncentive />
        </DashboardLayout>
    );
};

export default NFTIncentiveWithLayout; 