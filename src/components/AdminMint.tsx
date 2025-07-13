import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Space, message, Row, Col, Image, Typography, Badge } from 'antd';
import { GiftOutlined, UserOutlined } from '@ant-design/icons';
import { availableNFTs, NFTService } from '../services/nftService';

const { Title, Text } = Typography;
const { Option } = Select;

interface AdminMintProps {
    nftService?: NFTService;
    onMintSuccess?: () => void;
}

export const AdminMint: React.FC<AdminMintProps> = ({ nftService, onMintSuccess }) => {
    const [form] = Form.useForm();
    const [selectedNft, setSelectedNft] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const selectedNftInfo = selectedNft ? availableNFTs.find(nft => nft.id === selectedNft) : null;

    const onFinish = async (values: { recipientAddress: string; nftId: string }) => {
        if (!nftService) {
            message.error('NFT service not initialized');
            return;
        }

        setLoading(true);
        try {
            // Using admin mint method - no eligibility checks
            await nftService.adminMintNFT(values.recipientAddress, values.nftId);
            
            message.success({
                content: `"${selectedNftInfo?.name}" has been successfully minted to address: ${values.recipientAddress.slice(0, 8)}...${values.recipientAddress.slice(-8)}`,
                duration: 5
            });
            
            form.resetFields();
            setSelectedNft('');
            onMintSuccess?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to mint NFT');
        } finally {
            setLoading(false);
        }
    };

    const onNftChange = (nftId: string) => {
        setSelectedNft(nftId);
        form.setFieldsValue({ nftId });
    };

    return (
        <div style={{ padding: '0 24px' }}>
            <Row gutter={24}>
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space>
                                <GiftOutlined style={{ color: '#1890ff' }} />
                                Admin NFT Minting
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Recipient Wallet Address"
                                name="recipientAddress"
                                rules={[
                                    { required: true, message: 'Please enter the wallet address to receive the NFT' },
                                    { min: 20, message: 'Wallet address is too short' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Enter wallet address to receive the NFT"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Select NFT Type"
                                name="nftId"
                                rules={[{ required: true, message: 'Please select an NFT type' }]}
                            >
                                <Select
                                    placeholder="Select NFT type to mint"
                                    size="large"
                                    onChange={onNftChange}
                                >
                                    {availableNFTs.map(nft => (
                                        <Option key={nft.id} value={nft.id}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <Badge 
                                                    color={nft.category === 'discount' ? 'purple' : 'orange'} 
                                                />
                                                <span>{nft.name}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<GiftOutlined />}
                                    size="large"
                                    style={{ width: '100%' }}
                                >
                                    Mint NFT
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card 
                        title="Selected NFT Preview"
                        style={{ height: '100%' }}
                    >
                        {selectedNftInfo ? (
                            <div style={{ textAlign: 'center' }}>
                                <Title level={4}>{selectedNftInfo.name}</Title>
                                <div style={{ marginBottom: 16 }}>
                                    <Badge 
                                        color={selectedNftInfo.category === 'discount' ? 'purple' : 'orange'} 
                                        text={selectedNftInfo.category === 'discount' ? 'Discount Benefits' : 'Achievement Certificate'}
                                    />
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <Text type="secondary">
                                        Complete {selectedNftInfo.requiredRecords} health records
                                    </Text>
                                </div>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Text strong>Front</Text>
                                            <Image
                                                src={selectedNftInfo.frontImage}
                                                alt={`${selectedNftInfo.name} - Front`}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: 200,
                                                    borderRadius: 8,
                                                    border: '1px solid #d9d9d9',
                                                    marginTop: 8
                                                }}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Text strong>Back</Text>
                                            <Image
                                                src={selectedNftInfo.backImage}
                                                alt={`${selectedNftInfo.name} - Back`}
                                                style={{
                                                    width: '100%',
                                                    maxWidth: 200,
                                                    borderRadius: 8,
                                                    border: '1px solid #d9d9d9',
                                                    marginTop: 8
                                                }}
                                                fallback="data:image/png;base64,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"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <div style={{ marginTop: 16 }}>
                                    <Text style={{ fontSize: 12, color: '#666' }}>
                                        {selectedNftInfo.description}
                                    </Text>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                <Text type="secondary">
                                    Select an NFT to view preview
                                </Text>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}; 