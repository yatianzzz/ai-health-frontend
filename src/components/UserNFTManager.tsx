import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Modal, Descriptions, Typography, Input, Tooltip, message, Badge } from 'antd';
import { UserOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, GiftOutlined } from '@ant-design/icons';
import { availableNFTs } from '../services/nftService';

const { Title, Text } = Typography;
const { Search } = Input;

interface UserNFTData {
    walletAddress: string;
    nfts: string[];
    totalNFTs: number;
}

interface UserNFTManagerProps {
    refreshTrigger?: number;
}

export const UserNFTManager: React.FC<UserNFTManagerProps> = ({ refreshTrigger }) => {
    const [userNFTData, setUserNFTData] = useState<UserNFTData[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserNFTData | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    useEffect(() => {
        fetchUserNFTData();
    }, [refreshTrigger]);

    const fetchUserNFTData = () => {
        setLoading(true);
        try {
            const userData: UserNFTData[] = [];
            
            // 遍历localStorage查找所有用户的NFT数据
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('ownedNFTs_')) {
                    const walletAddress = key.replace('ownedNFTs_', '');
                    try {
                        const ownedNFTs = JSON.parse(localStorage.getItem(key) || '[]');
                        userData.push({
                            walletAddress,
                            nfts: ownedNFTs,
                            totalNFTs: ownedNFTs.length
                        });
                    } catch (error) {
                        console.error('Error parsing owned NFTs:', error);
                    }
                }
            }

            // 按NFT数量降序排序
            userData.sort((a, b) => b.totalNFTs - a.totalNFTs);
            setUserNFTData(userData);
        } catch (error) {
            console.error('Error fetching user NFT data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (user: UserNFTData) => {
        setSelectedUser(user);
        setDetailModalVisible(true);
    };

    const handleDeleteUserNFT = (walletAddress: string, nftId: string) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: `Are you sure you want to delete the ${getNFTName(nftId)} NFT for user ${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}?`,
            onOk: () => {
                try {
                    const key = `ownedNFTs_${walletAddress}`;
                    const ownedNFTs = JSON.parse(localStorage.getItem(key) || '[]');
                    const updatedNFTs = ownedNFTs.filter((id: string) => id !== nftId);
                    localStorage.setItem(key, JSON.stringify(updatedNFTs));
                    
                    message.success('NFT deleted successfully');
                    fetchUserNFTData();
                    setDetailModalVisible(false);
                } catch (error) {
                    message.error('Deletion failed');
                }
            }
        });
    };

    const getNFTName = (nftId: string): string => {
        const nft = availableNFTs.find(n => n.id === nftId);
        return nft?.name || nftId;
    };

    const getNFTCategory = (nftId: string): string => {
        const nft = availableNFTs.find(n => n.id === nftId);
        return nft?.category || 'unknown';
    };

    const filteredData = userNFTData.filter(user => 
        user.walletAddress.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Wallet Address',
            dataIndex: 'walletAddress',
            key: 'walletAddress',
            render: (address: string) => (
                <Space>
                    <UserOutlined />
                    <Text code>
                        {address.slice(0, 8)}...{address.slice(-8)}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'NFT Count',
            dataIndex: 'totalNFTs',
            key: 'totalNFTs',
            sorter: (a: UserNFTData, b: UserNFTData) => a.totalNFTs - b.totalNFTs,
            render: (count: number) => (
                <Tag color={count > 3 ? 'gold' : count > 1 ? 'blue' : 'default'}>
                    {count} NFTs
                </Tag>
            ),
        },
        {
            title: 'NFT Types',
            dataIndex: 'nfts',
            key: 'nfts',
            render: (nfts: string[]) => (
                <Space wrap>
                    {nfts.slice(0, 3).map(nftId => {
                        const category = getNFTCategory(nftId);
                        return (
                            <Tag 
                                key={nftId} 
                                color={category === 'discount' ? 'purple' : 'orange'}
                            >
                                {getNFTName(nftId)}
                            </Tag>
                        );
                    })}
                    {nfts.length > 3 && (
                        <Tag>+{nfts.length - 3} more</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: UserNFTData) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewDetails(record)}
                    >
                        View Details
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={3}>User NFT Management</Title>
                    <Search
                        placeholder="Search wallet address"
                        allowClear
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="walletAddress"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => 
                            `${range[0]}-${range[1]} of ${total} users`
                    }}
                />
            </Card>

            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        User NFT Details
                    </Space>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>
                ]}
                width={800}
            >
                {selectedUser && (
                    <div>
                        <Descriptions title="User Information" bordered column={2} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="Wallet Address" span={2}>
                                <Text code>{selectedUser.walletAddress}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Total NFTs">
                                <Badge count={selectedUser.totalNFTs} showZero color="blue" />
                            </Descriptions.Item>
                            <Descriptions.Item label="Types">
                                <Space wrap>
                                    {Array.from(new Set(selectedUser.nfts.map(nftId => getNFTCategory(nftId)))).map(category => (
                                        <Tag key={category} color={category === 'discount' ? 'purple' : 'orange'}>
                                            {category === 'discount' ? 'Discount Benefits' : 'Achievement Certificates'}
                                        </Tag>
                                    ))}
                                </Space>
                            </Descriptions.Item>
                        </Descriptions>

                        <Card title="Owned NFTs" style={{ marginTop: 16 }}>
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {selectedUser.nfts.map(nftId => {
                                    const nft = availableNFTs.find(n => n.id === nftId);
                                    return (
                                        <Card
                                            key={nftId}
                                            size="small"
                                            hoverable
                                            style={{ backgroundColor: '#fafafa' }}
                                        >
                                            <Space>
                                                <GiftOutlined />
                                                <div>
                                                    <Text strong>{nft?.name || nftId}</Text>
                                                    <br />
                                                    <Text type="secondary">{nft?.description}</Text>
                                                    <br />
                                                    <Tag color={nft?.category === 'discount' ? 'purple' : 'orange'}>
                                                        {nft?.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                                    </Tag>
                                                </div>
                                            </Space>
                                        </Card>
                                    );
                                })}
                            </Space>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
}; 