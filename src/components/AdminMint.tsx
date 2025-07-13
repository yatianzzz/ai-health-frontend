import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, message, Typography, Space, Badge, Descriptions, Row, Col, Tag } from 'antd';
import { GiftOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { NFT, NFTService, availableNFTs } from '../services/nftService';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminMintProps {
    nftService?: NFTService;
    onMintSuccess?: () => void;
}

export const AdminMint: React.FC<AdminMintProps> = ({ nftService, onMintSuccess }) => {
    const [form] = Form.useForm();
    const { username } = useAuth();
    const [loading, setLoading] = useState(false);
    const [selectedNft, setSelectedNft] = useState<NFT | null>(null);

    // Simple admin permission check - can be modified according to actual needs
    const isAdmin = username === 'admin' || username === 'administrator';

    const handleNftChange = (nftId: string) => {
        const nft = availableNFTs.find(n => n.id === nftId);
        setSelectedNft(nft || null);
    };

    const handleMint = async (values: { recipientAddress: string; nftId: string }) => {
        if (!isAdmin) {
            message.error('Only administrators can perform this operation');
            return;
        }

        if (!nftService) {
            message.error('NFT service not initialized');
            return;
        }

        setLoading(true);
        try {
            // Validate wallet address format (simple validation)
            if (!values.recipientAddress || values.recipientAddress.length < 32) {
                throw new Error('Please enter a valid wallet address');
            }

            await nftService.adminMintNFT(values.recipientAddress, values.nftId);
            
            const selectedNftInfo = availableNFTs.find(nft => nft.id === values.nftId);
            message.success(`Successfully minted ${selectedNftInfo?.name || values.nftId} to ${values.recipientAddress.slice(0, 8)}...${values.recipientAddress.slice(-8)}`);
            
            form.resetFields();
            setSelectedNft(null);
            onMintSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to mint NFT');
        } finally {
            setLoading(false);
        }
    };

    if (!isAdmin) {
        return (
            <Card>
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Title level={4} type="secondary">
                        Access Denied
                    </Title>
                    <Text type="secondary">
                        Only administrators can access the NFT minting function.
                    </Text>
                </div>
            </Card>
        );
    }

    return (
        <Card 
            title={
                <Space>
                    <GiftOutlined />
                    Admin NFT Minting
                </Space>
            }
            style={{ marginBottom: 24 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleMint}
                size="large"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Recipient Address"
                            name="recipientAddress"
                            rules={[
                                { required: true, message: 'Please enter the wallet address to receive the NFT' },
                                { min: 32, message: 'Wallet address length is insufficient' }
                            ]}
                        >
                            <Input
                                prefix={<WalletOutlined />}
                                placeholder="Enter the wallet address to receive the NFT"
                                showCount
                                maxLength={44}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Select NFT"
                            name="nftId"
                            rules={[{ required: true, message: 'Please select the NFT to mint' }]}
                        >
                            <Select
                                placeholder="Select NFT to mint"
                                onChange={handleNftChange}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase()) || false
                                }
                            >
                                {availableNFTs.map(nft => (
                                    <Option key={nft.id} value={nft.id}>
                                        {nft.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<GiftOutlined />}
                        size="large"
                        block
                    >
                        Mint NFT
                    </Button>
                </Form.Item>
            </Form>

            {/* Selected NFT Preview */}
            {selectedNft && (
                <Card title="NFT Preview" style={{ marginTop: 16, backgroundColor: '#f8f9fa' }}>
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Name">{selectedNft.name}</Descriptions.Item>
                        <Descriptions.Item label="Category">
                            <Tag color={selectedNft.category === 'discount' ? 'purple' : 'orange'}>
                                {selectedNft.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">{selectedNft.description}</Descriptions.Item>
                        <Descriptions.Item label="Required Records">{selectedNft.requiredRecords}</Descriptions.Item>
                    </Descriptions>
                </Card>
            )}
        </Card>
    );
}; 