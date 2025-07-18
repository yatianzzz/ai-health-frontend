import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Space, Badge, Modal, message, Empty, Image } from 'antd';
import { GiftOutlined, TrophyOutlined, PercentageOutlined, EyeOutlined, CloseOutlined } from '@ant-design/icons';
import { NFT, NFTService } from '../services/nftService';
import { RealNFTService } from '../services/realNftService';

const { Text, Title } = Typography;

interface NFTGalleryProps {
    nfts: NFT[];
    category: string;
    nftService?: NFTService | RealNFTService | null;
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

    // Get NFT concise explanation
    const getNFTExplanation = (nft: NFT): string => {
        switch (nft.id) {
            case '7R5percent':
                return 'Complete 7 health records to get 5% shopping discount';
            case '7R10percent':
                return 'Complete 7 health records to get 10% shopping discount';
            case '30R8percent':
                return 'Complete 30 health records to get 8% shopping discount';
            case '30R10percent':
                return 'Complete 30 health records to get 10% shopping discount';
            case 'regularDiet':
                return 'Record diet for 30 days to get Diet Master title';
            case 'PowerKing':
                return 'Record exercise for 30 days to get Exercise Master title';
            default:
                return nft.description || 'Reward for healthy living';
        }
    };

    const filteredNfts = nfts.filter(nft => {
        if (category === 'owned') return nft.isOwned;
        if (category === 'unowned') return !nft.isOwned;
        return true;
    });

    const handleCardClick = (nft: NFT) => {
        setSelectedNFT(nft);
        setDetailModalVisible(true);
    };

    const handleFlip = (nftId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(prev => ({
            ...prev,
            [nftId]: !prev[nftId]
        }));
    };

    const handleClaimNFT = async (nft: NFT) => {
        if (!nftService || !walletAddress) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, [nft.id]: true }));
        
        try {
            await nftService.claimNFT(nft.id);
            message.success('NFT claimed successfully!');
            if (onNFTMinted) {
                onNFTMinted();
            }
        } catch (error) {
            console.error('Failed to claim NFT:', error);
            message.error('Failed to claim NFT, please try again');
        } finally {
            setLoading(prev => ({ ...prev, [nft.id]: false }));
        }
    };

    const handleDepositNFT = async (nft: NFT) => {
        if (!nftService || !walletAddress) {
            message.error('Please connect your wallet first');
            return;
        }

        setLoading(prev => ({ ...prev, [nft.id]: true }));
        
        try {
            // This needs to be implemented based on specific NFT service
            if ('depositNFT' in nftService) {
                await nftService.depositNFT(nft.id);
                message.success('NFT deposited successfully!');
            } else {
                message.error('Current NFT service does not support deposit function');
            }
        } catch (error) {
            console.error('Failed to deposit NFT:', error);
            message.error('Failed to deposit NFT, please try again');
        } finally {
            setLoading(prev => ({ ...prev, [nft.id]: false }));
        }
    };

    if (filteredNfts.length === 0) {
        return (
            <Empty
                description={
                    category === 'owned' 
                        ? 'You haven\'t claimed any NFTs yet'
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
                                border: nft.isOwned ? '2px solid #52c41a' : '1px solid #d9d9d9',
                                height: 420, // 设置固定高度
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            bodyStyle={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
                            onClick={() => handleCardClick(nft)}
                        >
                            <div style={{ position: 'relative', height: 200, flexShrink: 0 }}>
                                <Image
                                    src={isFlipped[nft.id] ? nft.backImage : nft.frontImage}
                                    alt={nft.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    preview={false}
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Yk"
                                />
                                
                                <div style={{ 
                                    position: 'absolute', 
                                    top: 8, 
                                    right: 8, 
                                    display: 'flex', 
                                    gap: 8 
                                }}>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon={<EyeOutlined />}
                                        size="small"
                                        onClick={(e) => handleFlip(nft.id, e)}
                                        style={{ 
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                                            border: 'none' 
                                        }}
                                    />
                                    {nft.isOwned && (
                                        <Badge 
                                            count="Owned" 
                                            style={{ 
                                                backgroundColor: '#52c41a',
                                                fontSize: '10px',
                                                padding: '2px 6px'
                                            }} 
                                        />
                                    )}
                                </div>
                            </div>

                            <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <Space direction="vertical" size={8} style={{ width: '100%', height: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ fontSize: '16px' }}>
                                            {nft.category === 'achievement' && <TrophyOutlined />}
                                            {nft.category === 'discount' && <PercentageOutlined />}
                                            {nft.category === 'reward' && <GiftOutlined />}
                                        </div>
                                        <Text strong style={{ fontSize: '14px' }}>
                                            {nft.name}
                                        </Text>
                                    </div>
                                    
                                    {/* Concise NFT explanation - 固定高度 */}
                                    <div style={{ height: 40, overflow: 'hidden' }}>
                                        <Text type="secondary" style={{ 
                                            fontSize: '12px', 
                                            lineHeight: '1.4',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {getNFTExplanation(nft)}
                                        </Text>
                                    </div>
                                    
                                    {/* Progress bar */}
                                    <div style={{ marginTop: 8 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                            <Text style={{ fontSize: '11px', color: '#666' }}>
                                                Progress
                                            </Text>
                                            <Text style={{ fontSize: '11px', color: '#666' }}>
                                                {nft.currentRecords || 0}/{nft.requiredRecords || 0}
                                            </Text>
                                        </div>
                                        <div style={{ 
                                            width: '100%', 
                                            height: 4, 
                                            backgroundColor: '#f0f0f0', 
                                            borderRadius: 2,
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ 
                                                width: `${Math.min(((nft.currentRecords || 0) / (nft.requiredRecords || 1)) * 100, 100)}%`, 
                                                height: '100%', 
                                                backgroundColor: nft.isEligible ? '#52c41a' : '#1890ff',
                                                transition: 'width 0.3s ease'
                                            }} />
                                        </div>
                                    </div>
                                    
                                    {/* 底部按钮区域 - 固定在底部 */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        marginTop: 'auto',
                                        paddingTop: 8
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {nft.isEligible !== undefined && (
                                                <>
                                                    <div 
                                                        style={{ 
                                                            width: 6, 
                                                            height: 6, 
                                                            borderRadius: '50%',
                                                            backgroundColor: nft.isEligible ? '#52c41a' : '#ff4d4f',
                                                            boxShadow: nft.isEligible ? '0 0 4px rgba(82, 196, 26, 0.6)' : '0 0 4px rgba(255, 77, 79, 0.6)'
                                                        }}
                                                    />
                                                    <Text style={{ 
                                                        fontSize: '10px', 
                                                        color: nft.isEligible ? '#52c41a' : '#ff4d4f',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {nft.isEligible ? 'Claimable' : 'Not Claimable'}
                                                    </Text>
                                                </>
                                            )}
                                        </div>
                                        
                                        {!nft.isOwned && (
                                            <Button
                                                type={nft.isEligible ? "primary" : "default"}
                                                size="small"
                                                loading={loading[nft.id]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleClaimNFT(nft);
                                                }}
                                                disabled={!walletAddress || !nft.isEligible}
                                                style={!nft.isEligible ? {
                                                    backgroundColor: '#f5f5f5',
                                                    borderColor: '#d9d9d9',
                                                    color: '#8c8c8c',
                                                    opacity: 1
                                                } : {}}
                                            >
                                                {nft.isEligible ? 'Claim' : 'Insufficient'}
                                            </Button>
                                        )}
                                        
                                        {nft.isOwned && (
                                            <Button
                                                type="default"
                                                size="small"
                                                loading={loading[nft.id]}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDepositNFT(nft);
                                                }}
                                            >
                                                Deposit
                                            </Button>
                                        )}
                                    </div>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                title={selectedNFT?.name}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={selectedNFT ? [
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                    ...(selectedNFT.isOwned ? [
                        <Button 
                            key="deposit" 
                            type="primary"
                            loading={loading[selectedNFT.id]}
                            onClick={() => {
                                handleDepositNFT(selectedNFT);
                                setDetailModalVisible(false);
                            }}
                        >
                            Deposit to Chain
                        </Button>
                    ] : selectedNFT.isEligible ? [
                        <Button 
                            key="claim" 
                            type="primary"
                            loading={loading[selectedNFT.id]}
                            onClick={() => {
                                handleClaimNFT(selectedNFT);
                                setDetailModalVisible(false);
                            }}
                        >
                            Claim NFT
                        </Button>
                    ] : [
                        <Button 
                            key="insufficient" 
                            type="default"
                            disabled
                            style={{
                                backgroundColor: '#f5f5f5',
                                borderColor: '#d9d9d9',
                                color: '#8c8c8c',
                                opacity: 1
                            }}
                        >
                            Insufficient
                        </Button>
                    ])
                ] : null}
                width={600}
            >
                {selectedNFT && (
                    <div>
                        {/* Display both front and back sides simultaneously */}
                        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text strong style={{ fontSize: '14px' }}>Front</Text>
                                </div>
                                <Image
                                    src={selectedNFT.frontImage}
                                    alt={`${selectedNFT.name} - Front`}
                                    style={{ 
                                        width: '100%', 
                                        height: 200, 
                                        objectFit: 'contain',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 8
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ marginBottom: 8 }}>
                                    <Text strong style={{ fontSize: '14px' }}>Back</Text>
                                </div>
                                <Image
                                    src={selectedNFT.backImage}
                                    alt={`${selectedNFT.name} - Back`}
                                    style={{ 
                                        width: '100%', 
                                        height: 200, 
                                        objectFit: 'contain',
                                        border: '1px solid #f0f0f0',
                                        borderRadius: 8
                                    }}
                                />
                            </div>
                        </div>
                        
                        <Space direction="vertical" size={16} style={{ width: '100%' }}>
                            <div>
                                <Text strong>NFT Description: </Text>
                                <Text>{getNFTExplanation(selectedNFT)}</Text>
                            </div>
                            
                            <div style={{ display: 'flex', gap: 32 }}>
                                <div>
                                    <Text strong>Category: </Text>
                                    <Text>{selectedNFT.category === 'discount' ? 'Discount Benefit' : 'Achievement Certificate'}</Text>
                                </div>
                                <div>
                                    <Text strong>Rarity: </Text>
                                    <Text>{selectedNFT.rarity}</Text>
                                </div>
                                <div>
                                    <Text strong>Status: </Text>
                                    <Text style={{ color: selectedNFT.isOwned ? '#52c41a' : '#666' }}>
                                        {selectedNFT.isOwned ? 'Owned' : 'Not Owned'}
                                    </Text>
                                </div>
                            </div>
                            
                            {/* Progress information */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text strong>Completion Progress: </Text>
                                    <Text>{selectedNFT.currentRecords || 0}/{selectedNFT.requiredRecords || 0} records</Text>
                                </div>
                                <div style={{ 
                                    width: '100%', 
                                    height: 8, 
                                    backgroundColor: '#f0f0f0', 
                                    borderRadius: 4,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ 
                                        width: `${Math.min(((selectedNFT.currentRecords || 0) / (selectedNFT.requiredRecords || 1)) * 100, 100)}%`, 
                                        height: '100%', 
                                        backgroundColor: selectedNFT.isEligible ? '#52c41a' : '#1890ff',
                                        transition: 'width 0.3s ease'
                                    }} />
                                </div>
                            </div>
                            
                            {selectedNFT.isEligible !== undefined && (
                                <div>
                                    <Text strong>Eligibility Status: </Text>
                                    <Text style={{ color: selectedNFT.isEligible ? '#52c41a' : '#ff4d4f' }}>
                                        {selectedNFT.isEligible ? '✓ Eligible for claim' : '✗ Not eligible for claim'}
                                    </Text>
                                </div>
                            )}
                            
                            {selectedNFT.attributes && selectedNFT.attributes.length > 0 && (
                                <div>
                                    <Text strong>Attribute Details:</Text>
                                    <div style={{ 
                                        marginTop: 8,
                                        padding: 12,
                                        backgroundColor: '#fafafa',
                                        borderRadius: 6
                                    }}>
                                        {selectedNFT.attributes.map((attr, index) => (
                                            <div key={index} style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                padding: '4px 0',
                                                borderBottom: index < selectedNFT.attributes!.length - 1 ? '1px solid #f0f0f0' : 'none'
                                            }}>
                                                <Text style={{ color: '#666' }}>{attr.trait_type}:</Text>
                                                <Text strong>{attr.value}</Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Space>
                    </div>
                )}
            </Modal>
        </div>
    );
};