import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Progress, Tag, Typography, Space } from 'antd';
import { TrophyOutlined, GiftOutlined, UserOutlined, PercentageOutlined } from '@ant-design/icons';
import { NFT, availableNFTs } from '../services/nftService';

const { Title, Text } = Typography;

interface NFTStatisticsProps {
    refreshTrigger?: number;
}

interface NFTStat {
    id: string;
    name: string;
    category: string;
    totalMinted: number;
    requiredRecords?: number;
    mintedWallets: string[];
}

export const NFTStatistics: React.FC<NFTStatisticsProps> = ({ refreshTrigger }) => {
    const [stats, setStats] = useState<NFTStat[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, [refreshTrigger]);

    const fetchStatistics = () => {
        setLoading(true);
        try {
            // Simulate getting statistics data from localStorage
            const allStats: NFTStat[] = availableNFTs.map(nft => {
                const mintedWallets: string[] = [];
                
                // Traverse localStorage to find all wallets that own this NFT
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith('ownedNFTs_')) {
                        const walletAddress = key.replace('ownedNFTs_', '');
                        try {
                            const ownedNFTs = JSON.parse(localStorage.getItem(key) || '[]');
                            if (ownedNFTs.includes(nft.id)) {
                                mintedWallets.push(walletAddress);
                            }
                        } catch (error) {
                            console.error('Error parsing owned NFTs:', error);
                        }
                    }
                }

                return {
                    id: nft.id,
                    name: nft.name,
                    category: nft.category,
                    totalMinted: mintedWallets.length,
                    requiredRecords: nft.requiredRecords,
                    mintedWallets
                };
            });

            setStats(allStats);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalMinted = stats.reduce((sum, stat) => sum + stat.totalMinted, 0);
    const totalUsers = new Set(stats.flatMap(stat => stat.mintedWallets)).size;
    const discountNFTs = stats.filter(stat => stat.category === 'discount');
    const achievementNFTs = stats.filter(stat => stat.category === 'achievement');

    const columns = [
        {
            title: 'NFT Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: NFTStat) => (
                <Space direction="vertical" size="small">
                    <Text strong>{text}</Text>
                    <Tag color={record.category === 'discount' ? 'purple' : 'orange'}>
                        {record.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                    </Tag>
                </Space>
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text code>{text}</Text>
        },
        {
            title: 'Minted Count',
            dataIndex: 'totalMinted',
            key: 'totalMinted',
            render: (count: number) => (
                <Statistic value={count} suffix="items" valueStyle={{ fontSize: '16px' }} />
            ),
            sorter: (a: NFTStat, b: NFTStat) => a.totalMinted - b.totalMinted,
        },
        {
            title: 'Requirements',
            dataIndex: 'requiredRecords',
            key: 'requiredRecords',
            render: (records: number) => 
                records > 0 ? `${records} records` : 'Special conditions'
        },
        {
            title: 'Minting Progress',
            key: 'progress',
            render: (_: any, record: NFTStat) => {
                // Assume each NFT type has a target minting count of 100
                const targetCount = 100;
                const percent = Math.min((record.totalMinted / targetCount) * 100, 100);
                return (
                    <Progress 
                        percent={percent} 
                        size="small" 
                        format={() => `${record.totalMinted}/${targetCount}`}
                    />
                );
            }
        }
    ];

    return (
        <div>
            {/* Overall Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Minted"
                            value={totalMinted}
                            prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
                            suffix="NFTs"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Owners"
                            value={totalUsers}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            suffix="wallets"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Discount NFTs"
                            value={discountNFTs.reduce((sum, nft) => sum + nft.totalMinted, 0)}
                            prefix={<PercentageOutlined style={{ color: '#722ed1' }} />}
                            suffix="items"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Achievement NFTs"
                            value={achievementNFTs.reduce((sum, nft) => sum + nft.totalMinted, 0)}
                            prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
                            suffix="items"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Detailed Statistics Table */}
            <Card 
                title={
                    <Space>
                        <TrophyOutlined />
                        <span>NFT Detailed Statistics</span>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={stats}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    size="middle"
                />
            </Card>
        </div>
    );
}; 