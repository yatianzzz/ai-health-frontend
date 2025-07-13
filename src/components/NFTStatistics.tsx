import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Table, Progress, Badge, Spin, Empty } from 'antd';
import { GiftOutlined, TrophyOutlined, PercentageOutlined, UserOutlined, StarOutlined } from '@ant-design/icons';
import { NFTService } from '../services/nftService';

const { Title, Text } = Typography;

interface NFTStatisticsProps {
    nftService?: NFTService;
}

interface NFTStatsData {
    totalMinted: number;
    totalUsers: number;
    categoryStats: {
        discount: number;
        achievement: number;
    };
    popularNFTs: Array<{
        id: string;
        name: string;
        mintCount: number;
        percentage: number;
    }>;
    recentActivity: Array<{
        id: string;
        userName: string;
        nftName: string;
        action: string;
        timestamp: string;
    }>;
}

export const NFTStatistics: React.FC<NFTStatisticsProps> = ({ nftService }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<NFTStatsData | null>(null);

    useEffect(() => {
        loadStatistics();
    }, [nftService]);

    const loadStatistics = async () => {
        if (!nftService) return;
        
        setLoading(true);
        try {
            const data = await nftService.getNFTStatistics();
            setStats(data);
        } catch (error) {
            console.error('Failed to load NFT statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const activityColumns = [
        {
            title: 'User',
            dataIndex: 'userName',
            key: 'userName',
            render: (text: string) => (
                <Space>
                    <UserOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: 'NFT',
            dataIndex: 'nftName',
            key: 'nftName',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                const colorMap: { [key: string]: string } = {
                    'minted': 'green',
                    'transferred': 'blue',
                    'deposited': 'orange',
                    'received': 'purple'
                };
                return <Badge color={colorMap[action] || 'default'} text={action} />;
            },
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: string) => new Date(timestamp).toLocaleString(),
        },
    ];

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                    <Text>Loading NFT statistics...</Text>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <Empty 
                description="Unable to load statistics"
                style={{ padding: '60px 0' }}
            />
        );
    }

    return (
        <div style={{ padding: '0 24px' }}>
            {/* Overview Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Minted"
                            value={stats.totalMinted}
                            prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Discount NFTs"
                            value={stats.categoryStats.discount}
                            prefix={<PercentageOutlined style={{ color: '#722ed1' }} />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={6}>
                    <Card>
                        <Statistic
                            title="Achievement NFTs"
                            value={stats.categoryStats.achievement}
                            prefix={<TrophyOutlined style={{ color: '#fa8c16' }} />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Popular NFTs */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <StarOutlined style={{ color: '#faad14' }} />
                                Popular NFTs
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        {stats.popularNFTs.length > 0 ? (
                            <div>
                                {stats.popularNFTs.map((nft, index) => (
                                    <div key={nft.id} style={{ marginBottom: 16 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <Text strong>#{index + 1} {nft.name}</Text>
                                            <Text>{nft.mintCount} mints</Text>
                                        </div>
                                        <Progress 
                                            percent={nft.percentage} 
                                            size="small"
                                            strokeColor={{
                                                '0%': '#108ee9',
                                                '100%': '#87d068',
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty description="No popular NFTs data" />
                        )}
                    </Card>
                </Col>

                {/* Recent Activity */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <GiftOutlined style={{ color: '#1890ff' }} />
                                Recent Activity
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        {stats.recentActivity.length > 0 ? (
                            <Table
                                dataSource={stats.recentActivity}
                                columns={activityColumns}
                                pagination={{ pageSize: 5, size: 'small' }}
                                size="small"
                                rowKey="id"
                            />
                        ) : (
                            <Empty description="No recent activity" />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Category Distribution Chart */}
            <Row style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="NFT Category Distribution">
                        <Row gutter={48}>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #722ed1 0%, #ad85e4 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        color: 'white',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        {stats.categoryStats.discount}
                                    </div>
                                    <Title level={4}>Discount Benefits</Title>
                                    <Text type="secondary">
                                        {((stats.categoryStats.discount / stats.totalMinted) * 100).toFixed(1)}%
                                    </Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #fa8c16 0%, #ffc069 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        color: 'white',
                                        fontSize: '24px',
                                        fontWeight: 'bold'
                                    }}>
                                        {stats.categoryStats.achievement}
                                    </div>
                                    <Title level={4}>Achievement Certificates</Title>
                                    <Text type="secondary">
                                        {((stats.categoryStats.achievement / stats.totalMinted) * 100).toFixed(1)}%
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}; 