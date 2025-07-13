import React, { useState } from 'react';
import { Card, Row, Col, Badge, Button, Typography, Image, Empty, Modal, Descriptions, Space, message } from 'antd';
import { EyeOutlined, SwapOutlined, GiftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { NFT, NFTService } from '../services/nftService';

const { Text, Title } = Typography;

interface NFTGalleryProps {
    nfts: NFT[];
    category: string;
    nftService?: NFTService;
    walletAddress?: string;
    onNFTMinted?: () => void;
}

export const NFTGallery: React.FC<NFTGalleryProps> = ({ 
    nfts, 
    category, 
    nftService, 
    walletAddress,
    onNFTMinted 
}) => {
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
    const [isFlipped, setIsFlipped] = useState<{ [key: string]: boolean }>({});
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

    const filteredNfts = nfts.filter(nft => {
        if (category === 'owned') return nft.isOwned;
        if (category === 'unowned') return !nft.isOwned;
        return true;
    });

    const handleFlip = (nftId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(prev => ({
            ...prev,
            [nftId]: !prev[nftId]
        }));
    };

    const handleCardClick = (nft: NFT) => {
        setSelectedNFT(nft);
        setDetailModalVisible(true);
    };

    const handleCloseModal = () => {
        setDetailModalVisible(false);
        setSelectedNFT(null);
    };

    const handleMintNFT = async (nftId: string) => {
        if (!nftService || !walletAddress) {
            message.error('Wallet not connected or service unavailable');
            return;
        }

        setLoading(prev => ({ ...prev, [nftId]: true }));
        try {
            await nftService.mintNFT(walletAddress, nftId);
            message.success('NFT claimed successfully!');
            onNFTMinted?.();
        } catch (error: any) {
            message.error(error.message || 'Failed to claim NFT');
        } finally {
            setLoading(prev => ({ ...prev, [nftId]: false }));
        }
    };



    if (filteredNfts.length === 0) {
        return (
            <Empty
                description={
                    category === 'owned' 
                        ? 'You have not claimed any NFTs yet'
                        : category === 'unowned'
                        ? 'All NFTs have been claimed!'
                        : 'No NFTs available'
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={4} style={{ color: '#1890ff' }}>
                    {category === 'all' && `All NFTs (${filteredNfts.length} items)`}
                    {category === 'owned' && `Claimed NFTs (${filteredNfts.length} items)`}
                    {category === 'unowned' && `Unclaimed NFTs (${filteredNfts.length} items)`}
                </Title>
            </div>

            <Row gutter={[24, 24]}>
                {filteredNfts.map((nft) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={nft.id}>
                        <Card
                            hoverable
                            style={{
                                borderRadius: 12,
                                overflow: 'hidden',
                                position: 'relative',
                                opacity: nft.isOwned ? 1 : 0.8,
                                border: nft.isOwned ? '2px solid #52c41a' : '1px solid #d9d9d9'
                            }}
                            bodyStyle={{ padding: 0 }}
                            onClick={() => handleCardClick(nft)}
                        >
                            <div style={{ position: 'relative', height: 200 }}>
                                <Image
                                    src={isFlipped[nft.id] ? nft.backImage : nft.frontImage}
                                    alt={nft.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    preview={false}
                                    fallback="data:image/png;base64,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"
                                />
                                
                                {/* 状态标识 */}
                                <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 15 }}>
                                    {nft.isOwned ? (
                                        <Badge 
                                            status="success" 
                                            text="Claimed" 
                                            style={{ backgroundColor: '#f6ffed', color: '#52c41a', padding: '4px 8px', borderRadius: 6 }}
                                        />
                                    ) : (
                                        <Badge 
                                            status="default" 
                                            text="Unclaimed" 
                                            style={{ backgroundColor: '#fafafa', color: '#666', padding: '4px 8px', borderRadius: 6 }}
                                        />
                                    )}
                                </div>

                                {/* 类别标识 */}
                                <div style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 15 }}>
                                    <Badge 
                                        color={nft.category === 'discount' ? 'purple' : 'orange'} 
                                        text={nft.category === 'discount' ? 'Discount' : 'Achievement'}
                                        style={{ fontSize: 12 }}
                                    />
                                </div>

                                {/* 操作按钮组 - 只在已获得时显示 */}
                                {nft.isOwned && (
                                    <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 15 }}>
                                        <Space size={4}>
                                            <Button
                                                icon={<InfoCircleOutlined />}
                                                size="small"
                                                type="default"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                    border: '1px solid #d9d9d9'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(nft);
                                                }}
                                                title="View Details"
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                icon={<SwapOutlined />}
                                                size="small"
                                                type="primary"
                                                onClick={(e) => handleFlip(nft.id, e)}
                                                title="Flip Card"
                                            >
                                                Flip
                                            </Button>
                                        </Space>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: 16 }}>
                                <Title level={5} style={{ margin: 0, marginBottom: 8 }}>
                                    {nft.name}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12, display: 'block', lineHeight: '1.4' }}>
                                    {nft.description}
                                </Text>
                            </div>

                            {/* 未获得状态的全覆盖层 - 覆盖整个卡片 */}
                            {!nft.isOwned && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    gap: 12,
                                    zIndex: 12,
                                    borderRadius: 12
                                }}>
                                    {nft.progress && (
                                        <Text style={{ 
                                            color: 'white', 
                                            fontWeight: 'bold', 
                                            textAlign: 'center', 
                                            fontSize: 14,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                                        }}>
                                            {nft.progress}
                                        </Text>
                                    )}
                                    <Space>
                                        <Button
                                            icon={<InfoCircleOutlined />}
                                            type="default"
                                            size="small"
                                            style={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                border: '1px solid #d9d9d9'
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(nft);
                                            }}
                                        >
                                            Details
                                        </Button>
                                        {nft.isEligible ? (
                                            <Button
                                                icon={<GiftOutlined />}
                                                type="primary"
                                                size="small"
                                                loading={loading[nft.id]}
                                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMintNFT(nft.id);
                                                }}
                                            >
                                                Claim Now
                                            </Button>
                                        ) : (
                                            <Button
                                                icon={<GiftOutlined />}
                                                type="primary"
                                                size="small"
                                                disabled
                                                style={{ backgroundColor: '#d9d9d9', borderColor: '#d9d9d9' }}
                                            >
                                                Requirements Not Met
                                            </Button>
                                        )}
                                    </Space>
                                </div>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* NFT详情模态框 */}
            <Modal
                title={
                    <Space>
                        <InfoCircleOutlined />
                        NFT Details
                    </Space>
                }
                open={detailModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                    !selectedNFT?.isOwned && selectedNFT?.isEligible ? (
                        <Button
                            key="get"
                            type="primary"
                            icon={<GiftOutlined />}
                            loading={loading[selectedNFT.id]}
                            onClick={() => handleMintNFT(selectedNFT.id)}
                        >
                            Claim Now
                        </Button>
                    ) : !selectedNFT?.isOwned ? (
                        <Button
                            key="get"
                            type="primary"
                            disabled
                            icon={<GiftOutlined />}
                        >
                            Requirements Not Met
                        </Button>
                    ) : null
                ]}
                width={800}
            >
                {selectedNFT && (
                    <div>
                        <Row gutter={24}>
                            <Col span={12}>
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <Title level={4}>Front</Title>
                                    <Image
                                        src={selectedNFT.frontImage}
                                        alt={`${selectedNFT.name} - Front`}
                                        style={{
                                            width: '100%',
                                            maxWidth: 300,
                                            borderRadius: 8,
                                            border: '1px solid #d9d9d9'
                                        }}
                                        fallback="data:image/png;base64,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"
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                    <Title level={4}>Back</Title>
                                    <Image
                                        src={selectedNFT.backImage}
                                        alt={`${selectedNFT.name} - Back`}
                                        style={{
                                            width: '100%',
                                            maxWidth: 300,
                                            borderRadius: 8,
                                            border: '1px solid #d9d9d9'
                                        }}
                                        fallback="data:image/png;base64,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"
                                    />
                                </div>
                            </Col>
                        </Row>
                        
                        <Descriptions title="NFT Information" bordered column={1}>
                            <Descriptions.Item label="Name">
                                {selectedNFT.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Description">
                                {selectedNFT.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Category">
                                <Badge 
                                    color={selectedNFT.category === 'discount' ? 'purple' : 'orange'} 
                                    text={selectedNFT.category === 'discount' ? 'Discount Card' : 'Achievement Card'}
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Status">
                                {selectedNFT.isOwned ? (
                                    <Badge status="success" text="Claimed" />
                                ) : (
                                    <Badge status="default" text="Unclaimed" />
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="Progress">
                                {selectedNFT.progress}
                            </Descriptions.Item>
                            {selectedNFT.requiredRecords && selectedNFT.requiredRecords > 0 && (
                                <Descriptions.Item label="Requirements">
                                    Need to complete {selectedNFT.requiredRecords} health records
                                </Descriptions.Item>
                            )}
                            {selectedNFT.currentRecords !== undefined && (
                                <Descriptions.Item label="Current Records">
                                    {selectedNFT.currentRecords} records
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Eligibility Status">
                                {selectedNFT.isEligible ? (
                                    <Badge status="success" text="Eligible" />
                                ) : (
                                    <Badge status="warning" text="Requirements Not Met" />
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                )}
            </Modal>
        </div>
    );
}; 