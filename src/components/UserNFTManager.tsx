import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Space, Button, Modal, Descriptions, Typography, Input, Tooltip, message } from 'antd';
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
            title: '确认删除',
            content: `确定要删除用户 ${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)} 的 ${getNFTName(nftId)} NFT吗？`,
            onOk: () => {
                try {
                    const key = `ownedNFTs_${walletAddress}`;
                    const ownedNFTs = JSON.parse(localStorage.getItem(key) || '[]');
                    const updatedNFTs = ownedNFTs.filter((id: string) => id !== nftId);
                    localStorage.setItem(key, JSON.stringify(updatedNFTs));
                    
                    message.success('NFT删除成功');
                    fetchUserNFTData();
                    setDetailModalVisible(false);
                } catch (error) {
                    message.error('删除失败');
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
            title: '钱包地址',
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
            title: 'NFT数量',
            dataIndex: 'totalNFTs',
            key: 'totalNFTs',
            sorter: (a: UserNFTData, b: UserNFTData) => a.totalNFTs - b.totalNFTs,
            render: (count: number) => (
                <Tag color={count > 3 ? 'gold' : count > 1 ? 'blue' : 'default'}>
                    {count} 个NFT
                </Tag>
            ),
        },
        {
            title: 'NFT类型',
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
                        <Tag>+{nfts.length - 3} 更多</Tag>
                    )}
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: UserNFTData) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        查看详情
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card 
                title={
                    <Space>
                        <UserOutlined />
                        <span>用户NFT管理</span>
                    </Space>
                }
                extra={
                    <Search
                        placeholder="搜索钱包地址"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                }
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="walletAddress"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 个用户`,
                    }}
                />
            </Card>

            {/* 用户详情模态框 */}
            <Modal
                title={
                    <Space>
                        <UserOutlined />
                        <span>用户NFT详情</span>
                    </Space>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedUser && (
                    <div>
                        <Descriptions title="用户信息" bordered column={1} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="钱包地址">
                                <Text code>{selectedUser.walletAddress}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="NFT总数">
                                <Tag color="blue">{selectedUser.totalNFTs} 个</Tag>
                            </Descriptions.Item>
                        </Descriptions>

                        <Card title="拥有的NFT" size="small">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {selectedUser.nfts.map(nftId => {
                                    const nft = availableNFTs.find(n => n.id === nftId);
                                    return (
                                        <Card 
                                            key={nftId} 
                                            type="inner" 
                                            size="small"
                                            extra={
                                                <Tooltip title="删除此NFT">
                                                    <Button
                                                        type="text"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleDeleteUserNFT(selectedUser.walletAddress, nftId)}
                                                    />
                                                </Tooltip>
                                            }
                                        >
                                            <Space>
                                                <GiftOutlined />
                                                <div>
                                                    <Text strong>{nft?.name || nftId}</Text>
                                                    <br />
                                                    <Text type="secondary">{nft?.description}</Text>
                                                    <br />
                                                    <Tag color={nft?.category === 'discount' ? 'purple' : 'orange'}>
                                                        {nft?.category === 'discount' ? '折扣权益' : '成就证书'}
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