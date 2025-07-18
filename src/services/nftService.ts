import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import axios from 'axios';

export interface NFT {
    id: string;
    name: string;
    frontImage: string;
    backImage: string;
    description: string;
    progress?: string;
    isOwned: boolean;
    category: string;
    isEligible?: boolean;
    requiredRecords?: number;
    currentRecords?: number;
    rarity?: string;
    attributes?: Array<{
        trait_type: string;
        value: string;
    }>;
}

export interface UserActivity {
    id: number;
    userId: number;
    height: number;
    weight: number;
    bmi: number;
    activityDate: string;
    duration: number;
    exerciseType: string;
    steps: number;
    calories: number;
    maxHeartRate?: number;
    minHeartRate?: number;
}

export interface DietaryRecord {
    id: number;
    userId: number;
    recordDate: string;
    recordTime: any;
    mealType: string;
    notes: string;
    totalCalories: number;
    createTime?: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

// 健康管理相关的NFT列表
export const availableNFTs: NFT[] = [
    {
        id: '7R5percent',
        name: '5% Discount Card for 7 Records',
        frontImage: '/7R5percent/front.png',
        backImage: '/7R5percent/back.png',
        description: 'Complete 7 health records (exercise + diet) to get 5% purchase discount. Front shows record progress, back shows discount benefits.',
        progress: '0/7 records completed',
        isOwned: false,
        category: 'discount',
        requiredRecords: 7,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: '7R10percent',
        name: '10% Discount Card for 7 Records',
        frontImage: '/7R10percent/front.png',
        backImage: '/7R10percent/back.png',
        description: 'Complete 7 quality health records (exercise + diet) to get 10% purchase discount. Front shows record progress, back shows discount benefits.',
        progress: '0/7 records completed',
        isOwned: false,
        category: 'discount',
        requiredRecords: 7,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: '30R8percent',
        name: '8% Discount Card for 30 Records',
        frontImage: '/30R8percent/front.png',
        backImage: '/30R8percent/back.png',
        description: 'Complete 30 continuous health records (exercise + diet) to get 8% purchase discount. Front shows record progress, back shows discount benefits.',
        progress: '0/30 records completed',
        isOwned: false,
        category: 'discount',
        requiredRecords: 30,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: '30R10percent',
        name: '10% Discount Card for 30 Records',
        frontImage: '/30R10percent/front.png',
        backImage: '/30R10percent/back.png',
        description: 'Complete 30 high-quality health records (exercise + diet) to get 10% purchase discount. Front shows record progress, back shows discount benefits.',
        progress: '0/30 records completed',
        isOwned: false,
        category: 'discount',
        requiredRecords: 30,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: 'regularDiet',
        name: 'Diet Master',
        frontImage: '/regularDiet/front.png',
        backImage: '/regularDiet/back.png',
        description: 'Complete 30 diet records to master regular eating habits and get nutrition expert certification. Front shows diet habit tracking, back shows professional certification.',
        progress: '0/30 diet records completed',
        isOwned: false,
        category: 'achievement',
        requiredRecords: 30,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: 'PowerKing',
        name: 'Exercise Master',
        frontImage: '/PowerKing/front.png',
        backImage: '/PowerKing/back.png',
        description: 'Complete 30 exercise records to reach top fitness level and earn the Exercise Master title. Front shows strength training progress, back shows royal honor.',
        progress: '0/30 exercise records completed',
        isOwned: false,
        category: 'achievement',
        requiredRecords: 30,
        currentRecords: 0,
        isEligible: false
    }
];

export class NFTService {
    private connection: Connection;
    private program: Program; // Changed from NFTProgram to Program
    private provider: AnchorProvider;

    constructor(connection: Connection, program: Program, provider: AnchorProvider) {
        this.connection = connection;
        this.program = program;
        this.provider = provider;
    }

    // 添加缺少的claimNFT方法
    async claimNFT(nftId: string): Promise<boolean> {
        try {
            // 检查资格
            const isEligible = await this.checkNFTEligibility(nftId);
            if (!isEligible) {
                throw new Error('Not eligible for this NFT');
            }

            // 将NFT标记为已拥有
            const walletAddress = this.provider.wallet.publicKey?.toString();
            if (!walletAddress) {
                throw new Error('Wallet not connected');
            }

            const ownedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
            const ownedNFTList = ownedNFTs ? JSON.parse(ownedNFTs) : [];
            
            if (!ownedNFTList.includes(nftId)) {
                ownedNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${walletAddress}`, JSON.stringify(ownedNFTList));
            }

            return true;
        } catch (error) {
            console.error('Error claiming NFT:', error);
            throw error;
        }
    }

    // 添加depositNFT方法
    async depositNFT(nftId: string): Promise<boolean> {
        try {
            const walletAddress = this.provider.wallet.publicKey?.toString();
            if (!walletAddress) {
                throw new Error('Wallet not connected');
            }

            // 模拟存储到链上
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            if (!chainNFTList.includes(nftId)) {
                chainNFTList.push(nftId);
                localStorage.setItem(`chainNFTs_${walletAddress}`, JSON.stringify(chainNFTList));
            }

            return true;
        } catch (error) {
            console.error('Error depositing NFT:', error);
            throw error;
        }
    }

    // Get user activity records
    async getUserActivities(): Promise<UserActivity[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not logged in');
            }

            console.log('Fetching user activities from API...');
            const response = await axios.get<ApiResponse<UserActivity[]>>(
                'http://localhost:8080/api/user-activities',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('API Response:', response.data);
            
            if (response.data.code === 200) {
                const activities = response.data.data;
                console.log(`Fetched ${activities.length} user activity records:`, activities);
                return activities;
            } else {
                throw new Error(response.data.message || 'Failed to fetch user activity records');
            }
        } catch (error: any) {
            console.error('Error fetching user activities:', error?.message || 'Unknown error');
            console.error('Full error:', error);
            return [];
        }
    }

    // Get user dietary records
    async getUserDietaryRecords(): Promise<DietaryRecord[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Not logged in');
            }

            console.log('Fetching user dietary records from API...');
            const response = await axios.get<ApiResponse<DietaryRecord[]>>(
                'http://localhost:8080/api/dietary-records',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log('API Response:', response.data);
            
            if (response.data.code === 200) {
                const records = response.data.data;
                console.log(`Fetched ${records.length} dietary records:`, records);
                return records;
            } else {
                throw new Error(response.data.message || 'Failed to fetch dietary records');
            }
        } catch (error: any) {
            console.error('Error fetching user dietary records:', error?.message || 'Unknown error');
            console.error('Full error:', error);
            return [];
        }
    }

    // 检查NFT获得资格
    async checkNFTEligibility(nftId: string): Promise<boolean> {
        try {
            const nft = availableNFTs.find(n => n.id === nftId);
            if (!nft) {
                return false;
            }

            const userActivities = await this.getUserActivities();
            const userDietaryRecords = await this.getUserDietaryRecords();
            const requiredRecords = nft.requiredRecords || 0;

            // For 7R and 30R type NFTs (discount cards), check total exercise + diet records
            if (nft.id.includes('R')) {
                const totalRecords = userActivities.length + userDietaryRecords.length;
                console.log(`${nft.id} discount card check: needs ${requiredRecords} records, exercise ${userActivities.length} + diet ${userDietaryRecords.length} = total ${totalRecords} records`);
                return totalRecords >= requiredRecords;
            }

            // For achievement certificate NFTs, check specific type of records
            if (nft.id === 'regularDiet') {
                // Diet King: needs 30 diet records
                console.log(`Diet King check: needs ${requiredRecords} diet records, currently has ${userDietaryRecords.length} records`);
                return userDietaryRecords.length >= requiredRecords;
            }

            if (nft.id === 'PowerKing') {
                // Exercise King: needs 30 exercise records
                console.log(`Exercise King check: needs ${requiredRecords} exercise records, currently has ${userActivities.length} records`);
                return userActivities.length >= requiredRecords;
            }

            // Other types of NFTs, temporarily return false
            return false;
        } catch (error: any) {
            console.error('Error checking NFT eligibility:', error?.message || 'Unknown error');
            return false;
        }
    }

    // 查询用户拥有的NFT
    async getUserNFTs(walletAddress: string): Promise<string[]> {
        try {
            const userPublicKey = new PublicKey(walletAddress);
            // 这里应该调用实际的链上查询
            // 暂时返回模拟数据，实际部署时需要连接智能合约
            const mockOwnedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
            return mockOwnedNFTs ? JSON.parse(mockOwnedNFTs) : [];
        } catch (error: any) {
            console.error('Error fetching user NFTs:', error?.message || 'Unknown error');
            return [];
        }
    }

    // Mint NFT到指定地址
    async mintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        try {
            // 验证NFT ID是否有效
            const nftExists = availableNFTs.some(nft => nft.id === nftId);
            if (!nftExists) {
                throw new Error(`NFT ID "${nftId}" does not exist`);
            }

            // 检查用户是否有资格获得这个NFT
            const isEligible = await this.checkNFTEligibility(nftId);
            if (!isEligible) {
                throw new Error('You have not met the conditions to obtain this NFT');
            }

            // 暂时使用localStorage模拟mint过程
            // 实际部署时需要调用智能合约
            const existingNFTs = localStorage.getItem(`ownedNFTs_${recipientAddress}`);
            const ownedNFTs = existingNFTs ? JSON.parse(existingNFTs) : [];
            
            if (!ownedNFTs.includes(nftId)) {
                ownedNFTs.push(nftId);
                localStorage.setItem(`ownedNFTs_${recipientAddress}`, JSON.stringify(ownedNFTs));
            }

            console.log(`Successfully minted NFT ${nftId} to ${recipientAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error minting NFT:', error?.message || 'Unknown error');
            throw error;
        }
    }

    // 管理员版本的Mint NFT - 不检查资格条件
    async adminMintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        try {
            // 验证NFT ID是否有效
            const nftExists = availableNFTs.some(nft => nft.id === nftId);
            if (!nftExists) {
                throw new Error(`NFT ID "${nftId}" does not exist`);
            }

            // 管理员铸造不需要检查资格条件
            // 暂时使用localStorage模拟mint过程
            // 实际部署时需要调用智能合约
            const existingNFTs = localStorage.getItem(`ownedNFTs_${recipientAddress}`);
            const ownedNFTs = existingNFTs ? JSON.parse(existingNFTs) : [];
            
            if (!ownedNFTs.includes(nftId)) {
                ownedNFTs.push(nftId);
                localStorage.setItem(`ownedNFTs_${recipientAddress}`, JSON.stringify(ownedNFTs));
            }

            console.log(`Admin successfully minted NFT ${nftId} to ${recipientAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error admin minting NFT:', error?.message || 'Unknown error');
            throw error;
        }
    }

    // 获取所有NFT，并标记用户拥有的NFT和资格状态
    async getAllNFTsWithOwnership(walletAddress: string): Promise<NFT[]> {
        try {
            const ownedNFTs = await this.getUserNFTs(walletAddress);
            const userActivities = await this.getUserActivities();
            const userDietaryRecords = await this.getUserDietaryRecords();
            
            console.log(`Wallet address: ${walletAddress}`);
            console.log(`Owned NFTs: ${ownedNFTs.length} items`, ownedNFTs);
            console.log(`User activity records: ${userActivities.length} records`, userActivities);
            console.log(`User dietary records: ${userDietaryRecords.length} records`, userDietaryRecords);
            
            return availableNFTs.map(nft => {
                const isOwned = ownedNFTs.includes(nft.id);
                let currentRecords = 0;
                let isEligible = false;
                let progressText = '';

                if (nft.id.includes('R')) {
                    // Discount card NFT: total exercise + diet records
                    currentRecords = userActivities.length + userDietaryRecords.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} records completed (exercise ${userActivities.length} + diet ${userDietaryRecords.length})`;
                } else if (nft.id === 'regularDiet') {
                    // Diet King: only count diet records
                    currentRecords = userDietaryRecords.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} diet records completed`;
                } else if (nft.id === 'PowerKing') {
                    // Exercise King: only count exercise records
                    currentRecords = userActivities.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} exercise records completed`;
                }

                // 添加rarity和attributes属性
                const getRarity = (nftId: string): string => {
                    if (nftId.includes('10percent')) return 'Rare';
                    if (nftId.includes('8percent')) return 'Uncommon';
                    if (nftId.includes('5percent')) return 'Common';
                    if (nftId === 'PowerKing' || nftId === 'regularDiet') return 'Epic';
                    return 'Common';
                };

                const getAttributes = (nftId: string) => {
                    const baseAttributes = [
                        { trait_type: 'Type', value: nft.category === 'discount' ? 'Discount Card' : 'Achievement' }
                    ];

                    // Add requirements based on NFT type
                    if (nftId.includes('percent')) {
                        // Discount card NFTs
                        baseAttributes.push({ trait_type: 'Requirements', value: `${(nft.requiredRecords || 0)} Records` });
                        const discount = nftId.match(/(\d+)percent/)?.[1] || '0';
                        baseAttributes.push({ trait_type: 'Discount', value: `${discount}%` });
                    } else if (nftId === 'PowerKing') {
                        baseAttributes.push({ trait_type: 'Requirements', value: '30 Exercise Records' });
                        baseAttributes.push({ trait_type: 'Title', value: 'Exercise Master' });
                    } else if (nftId === 'regularDiet') {
                        baseAttributes.push({ trait_type: 'Requirements', value: '30 Diet Records' });
                        baseAttributes.push({ trait_type: 'Title', value: 'Diet Master' });
                    }

                    return baseAttributes;
                };

                return {
                    ...nft,
                    isOwned,
                    isEligible,
                    progress: progressText,
                    currentRecords,
                    rarity: getRarity(nft.id),
                    attributes: getAttributes(nft.id)
                };
            });
        } catch (error: any) {
            console.error('Error getting NFTs with ownership:', error?.message || 'Unknown error');
            return availableNFTs;
        }
    }

    // 根据类别筛选NFT
    filterNFTsByCategory(nfts: NFT[], category: string): NFT[] {
        switch (category) {
            case 'all':
                return nfts;
            case 'owned':
                return nfts.filter(nft => nft.isOwned);
            case 'unowned':
                return nfts.filter(nft => !nft.isOwned);
            default:
                return nfts;
        }
    }

    // 与健康管理系统集成：根据用户健康数据更新NFT状态
    updateNFTProgressByHealthData(userHealthData: any): void {
        // 这里可以根据用户的健康数据更新NFT的进度
        // 比如根据连续运动天数、饮食记录等来更新对应的NFT状态
        console.log('Updating NFT progress based on health data:', userHealthData);
    }

    // 钱包交互功能 - 存入NFT到链上
    async depositNFTToChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            // 检查用户是否拥有这个NFT
            const ownedNFTs = await this.getUserNFTs(walletAddress);
            if (!ownedNFTs.includes(nftId)) {
                throw new Error('您不拥有此NFT');
            }

            // 实际部署时需要调用智能合约来存入NFT到链上
            // 这里暂时使用模拟方式
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            if (!chainNFTList.includes(nftId)) {
                chainNFTList.push(nftId);
                localStorage.setItem(`chainNFTs_${walletAddress}`, JSON.stringify(chainNFTList));
            }

            console.log(`Successfully deposited NFT ${nftId} to chain for ${walletAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error depositing NFT to chain:', error?.message || 'Unknown error');
            throw error;
        }
    }

    // 钱包交互功能 - 从链上接收NFT
    async receiveNFTFromChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            // 检查链上是否有这个NFT
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            if (!chainNFTList.includes(nftId)) {
                throw new Error('NFT not found on chain');
            }

            // 实际部署时需要调用智能合约从链上接收NFT
            // 这里暂时使用模拟方式
            const ownedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
            const ownedNFTList = ownedNFTs ? JSON.parse(ownedNFTs) : [];
            
            if (!ownedNFTList.includes(nftId)) {
                ownedNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${walletAddress}`, JSON.stringify(ownedNFTList));
            }

            console.log(`Successfully received NFT ${nftId} from chain for ${walletAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error receiving NFT from chain:', error?.message || 'Unknown error');
            throw error;
        }
    }

    // 获取链上NFT列表
    async getChainNFTs(walletAddress: string): Promise<string[]> {
        try {
            // 实际部署时需要调用智能合约查询链上NFT
            // 这里暂时使用模拟方式
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            return chainNFTs ? JSON.parse(chainNFTs) : [];
        } catch (error: any) {
            console.error('Error fetching chain NFTs:', error?.message || 'Unknown error');
            return [];
        }
    }

    // 转移NFT到其他地址
    async transferNFT(nftId: string, fromAddress: string, toAddress: string): Promise<boolean> {
        try {
            // 检查发送者是否拥有这个NFT
            const ownedNFTs = await this.getUserNFTs(fromAddress);
            if (!ownedNFTs.includes(nftId)) {
                throw new Error('您不拥有此NFT');
            }

            // 实际部署时需要调用智能合约进行转移
            // 这里暂时使用模拟方式
            const fromNFTs = localStorage.getItem(`ownedNFTs_${fromAddress}`);
            const fromNFTList = fromNFTs ? JSON.parse(fromNFTs) : [];
            const updatedFromList = fromNFTList.filter((id: string) => id !== nftId);
            localStorage.setItem(`ownedNFTs_${fromAddress}`, JSON.stringify(updatedFromList));

            const toNFTs = localStorage.getItem(`ownedNFTs_${toAddress}`);
            const toNFTList = toNFTs ? JSON.parse(toNFTs) : [];
            if (!toNFTList.includes(nftId)) {
                toNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${toAddress}`, JSON.stringify(toNFTList));
            }

            console.log(`Successfully transferred NFT ${nftId} from ${fromAddress} to ${toAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error transferring NFT:', error?.message || 'Unknown error');
            throw error;
        }
    }
} 