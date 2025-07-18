import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Space, Alert, Spin, Button, message } from 'antd';
import { SettingOutlined, BarChartOutlined, UserOutlined, GiftOutlined, ReloadOutlined, DatabaseOutlined, ClearOutlined } from '@ant-design/icons';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { SOLANA_RPC_ENDPOINT, getWalletAdapters } from '../config/wallet';
import { WalletConnect } from '../components/WalletConnect';
import { AdminMint } from '../components/AdminMint';
import { NFTStatistics } from '../components/NFTStatistics';
import { UserNFTManager } from '../components/UserNFTManager';
import { NFTService } from '../services/nftService';
import { RealNFTService } from '../services/realNftService';
import { getNFTProgram } from '../contracts/nft';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { initializeDemoData, clearDemoData, hasDemoData } from '../utils/demoData';

const { Title, Text, Paragraph } = Typography;

require('@solana/wallet-adapter-react-ui/styles.css');

// NFT Admin Page Core Component
const NFTAdminCore: React.FC = () => {
    const { connected, publicKey } = useWallet();
    const { connection } = useConnection();
    const { username } = useAuth();
    const [nftService, setNftService] = useState<NFTService | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Admin permission check
    const isAdmin = username === 'admin' || username === 'administrator';

    useEffect(() => {
        if (connected && publicKey) {
            try {
                const provider = new AnchorProvider(connection, (window as any).solana, {});
                const program = getNFTProgram(provider);
                const service = new NFTService(connection, program, provider);
                setNftService(service);
            } catch (error: any) {
                console.error('Error initializing NFT service:', error);
            }
        }
    }, [connected, publicKey, connection]);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleMintSuccess = () => {
        handleRefresh();
    };

    const handleInitializeDemoData = () => {
        initializeDemoData();
        message.success('Demo data initialized successfully!');
        handleRefresh();
    };

    const handleClearDemoData = () => {
        clearDemoData();
        message.success('Demo data cleared successfully!');
        handleRefresh();
    };

    if (!isAdmin) {
        return (
            <div style={{ padding: '24px' }}>
                <Card>
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Title level={3} type="danger">Access Denied</Title>
                        <Paragraph>
                            You do not have administrator permission to access this page. Please contact the system administrator for appropriate permissions.
                        </Paragraph>
                        <Text type="secondary">Current user: {username}</Text>
                    </div>
                </Card>
            </div>
        );
    }

    const tabItems = [
        {
            key: 'mint',
            label: (
                <Space>
                    <GiftOutlined />
                    NFT Minting
                </Space>
            ),
            children: (
                <AdminMint 
                    nftService={nftService || undefined} 
                    onMintSuccess={handleMintSuccess}
                />
            )
        },
        {
            key: 'statistics',
            label: (
                <Space>
                    <BarChartOutlined />
                    Statistics
                </Space>
            ),
            children: <NFTStatistics refreshTrigger={refreshTrigger} />
        },
        {
            key: 'users',
            label: (
                <Space>
                    <UserOutlined />
                    User Management
                </Space>
            ),
            children: <UserNFTManager refreshTrigger={refreshTrigger} />
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Page Header */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            <SettingOutlined style={{ marginRight: 12 }} />
                            NFT Management Center
                        </Title>
                        <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                            Manage NFT minting, view statistics, and manage user NFTs
                        </Paragraph>
                    </div>
                    <Space>
                        <Button 
                            icon={<DatabaseOutlined />} 
                            onClick={handleInitializeDemoData}
                        >
                            Initialize Demo Data
                        </Button>
                        <Button 
                            icon={<ClearOutlined />} 
                            onClick={handleClearDemoData}
                            danger
                        >
                            Clear Demo Data
                        </Button>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={handleRefresh}
                        >
                            Refresh Data
                        </Button>
                        <WalletConnect />
                    </Space>
                </div>
            </Card>

            {/* Admin Info Card */}
            <Card style={{ marginBottom: 24 }}>
                <Space>
                    <UserOutlined style={{ color: '#52c41a' }} />
                    <Text strong>Administrator: {username}</Text>
                    <Text type="secondary">|</Text>
                    <Text type="secondary">
                        Wallet Status: {connected 
                            ? `${publicKey?.toString().slice(0, 8)}...${publicKey?.toString().slice(-8)}`
                            : 'Not Connected'
                        }
                    </Text>
                </Space>
            </Card>

            {/* Alert Message */}
            {!connected && (
                <Alert
                    message="Wallet Connection Recommended"
                    description="Connect your Solana wallet to access full management features, including on-chain NFT operations."
                    type="warning"
                    showIcon
                    style={{ marginBottom: 24 }}
                />
            )}

            {/* Management Functions Area */}
            <Card>
                <Tabs
                    defaultActiveKey="mint"
                    items={tabItems}
                    size="large"
                    tabBarStyle={{ marginBottom: 24 }}
                />
            </Card>

            {/* Loading State */}
            {isLoading && (
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <Space direction="vertical" align="center">
                        <Spin size="large" />
                        <Text>Processing request...</Text>
                    </Space>
                </div>
            )}
        </div>
    );
};

// Main NFT Admin page component with wallet providers
const NFTAdmin: React.FC = () => {
    const wallets = getWalletAdapters();
    
    return (
        <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <NFTAdminCore />
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

// NFT Admin page with layout
const NFTAdminWithLayout: React.FC = () => {
    return (
        <DashboardLayout>
            <NFTAdmin />
        </DashboardLayout>
    );
};

export default NFTAdminWithLayout; 