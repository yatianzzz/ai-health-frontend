import { 
    Connection, 
    PublicKey, 
    Transaction, 
    Keypair, 
    SystemProgram, 
    SYSVAR_RENT_PUBKEY 
} from '@solana/web3.js';
import { AnchorProvider, BN, web3 } from '@project-serum/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
    getNFTProgram, 
    getUserRecordPDA, 
    getMetadataAddress, 
    getMasterEditionAddress,
    NftMetadata, 
    HealthData, 
    HealthNFTProgram,
    NFT_PROGRAM_ID 
} from '../contracts/nft';
import { NFT, UserActivity, DietaryRecord, ApiResponse } from './nftService';

// API 基础 URL
const API_BASE_URL = 'http://localhost:8080';

// NFT 数据定义
const ALL_NFTS: Omit<NFT, 'isOwned' | 'isEligible' | 'progress' | 'currentRecords'>[] = [
    {
        id: '7R5percent',
        name: '5% Discount Card for 7 Records',
        frontImage: '/7R5percent/front.png',
        backImage: '/7R5percent/back.png',
        description: 'Complete 7 health records (exercise + diet) to get 5% discount',
        category: 'discount',
        requiredRecords: 7,
        rarity: 'common',
        attributes: [
            { trait_type: 'Type', value: 'Discount Card' },
            { trait_type: 'Discount', value: '5%' },
            { trait_type: 'Requirements', value: '7 Records' }
        ]
    },
    {
        id: '7R10percent',
        name: '10% Discount Card for 7 Records',
        frontImage: '/7R10percent/front.png',
        backImage: '/7R10percent/back.png',
        description: 'Complete 7 health records (exercise + diet) to get 10% discount',
        category: 'discount',
        requiredRecords: 7,
        rarity: 'common',
        attributes: [
            { trait_type: 'Type', value: 'Discount Card' },
            { trait_type: 'Discount', value: '10%' },
            { trait_type: 'Requirements', value: '7 Records' }
        ]
    },
    {
        id: '30R8percent',
        name: '8% Discount Card for 30 Records',
        frontImage: '/30R8percent/front.png',
        backImage: '/30R8percent/back.png',
        description: 'Complete 30 health records (exercise + diet) to get 8% discount',
        category: 'discount',
        requiredRecords: 30,
        rarity: 'uncommon',
        attributes: [
            { trait_type: 'Type', value: 'Discount Card' },
            { trait_type: 'Discount', value: '8%' },
            { trait_type: 'Requirements', value: '30 Records' }
        ]
    },
    {
        id: '30R10percent',
        name: '10% Discount Card for 30 Records',
        frontImage: '/30R10percent/front.png',
        backImage: '/30R10percent/back.png',
        description: 'Complete 30 health records (exercise + diet) to get 10% discount',
        category: 'discount',
        requiredRecords: 30,
        rarity: 'uncommon',
        attributes: [
            { trait_type: 'Type', value: 'Discount Card' },
            { trait_type: 'Discount', value: '10%' },
            { trait_type: 'Requirements', value: '30 Records' }
        ]
    },
    {
        id: 'regularDiet',
        name: 'Diet Master',
        frontImage: '/regularDiet/front.png',
        backImage: '/regularDiet/back.png',
        description: 'Complete 30 diet records to get Diet Master title',
        category: 'achievement',
        requiredRecords: 30,
        rarity: 'rare',
        attributes: [
            { trait_type: 'Type', value: 'Achievement' },
            { trait_type: 'Title', value: 'Diet Master' },
            { trait_type: 'Requirements', value: '30 Diet Records' }
        ]
    },
    {
        id: 'PowerKing',
        name: 'Exercise Master',
        frontImage: '/PowerKing/front.png',
        backImage: '/PowerKing/back.png',
        description: 'Complete 30 exercise records to get Exercise Master title',
        category: 'achievement',
        requiredRecords: 30,
        rarity: 'rare',
        attributes: [
            { trait_type: 'Type', value: 'Achievement' },
            { trait_type: 'Title', value: 'Exercise Master' },
            { trait_type: 'Requirements', value: '30 Exercise Records' }
        ]
    }
];

export class RealNFTService {
    private connection: Connection;
    private program: HealthNFTProgram;
    private provider: AnchorProvider;
    private wallet: any;

    constructor(connection: Connection, wallet: any) {
        this.connection = connection;
        this.wallet = wallet;
        this.provider = new AnchorProvider(connection, wallet, {});
        this.program = getNFTProgram(this.provider);
    }

    // 获取用户活动记录
    async getUserActivities(): Promise<UserActivity[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/api/user-activities`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user activities');
            }

            const data: ApiResponse<UserActivity[]> = await response.json();
            if (data.code !== 200) {
                throw new Error(data.message || 'Failed to fetch user activities');
            }

            return data.data || [];
        } catch (error) {
            console.error('Error fetching user activities:', error);
            return [];
        }
    }

    // 获取用户饮食记录
    async getUserDietaryRecords(): Promise<DietaryRecord[]> {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/api/dietary-records`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dietary records');
            }

            const data: ApiResponse<DietaryRecord[]> = await response.json();
            if (data.code !== 200) {
                throw new Error(data.message || 'Failed to fetch dietary records');
            }

            return data.data || [];
        } catch (error) {
            console.error('Error fetching dietary records:', error);
            return [];
        }
    }

    // 检查NFT获得资格
    async checkNFTEligibility(nftId: string): Promise<boolean> {
        try {
            const [activities, dietaryRecords] = await Promise.all([
                this.getUserActivities(),
                this.getUserDietaryRecords()
            ]);

            const activityCount = activities.length;
            const dietaryCount = dietaryRecords.length;
            const totalRecords = activityCount + dietaryCount;

            console.log(`用户活动记录: ${activityCount} 条`);
            console.log(`用户饮食记录: ${dietaryCount} 条`);

            switch (nftId) {
                case '7R5percent':
                case '7R10percent':
                    return totalRecords >= 7;
                case '30R8percent':
                case '30R10percent':
                    return totalRecords >= 30;
                case 'regularDiet':
                    return dietaryCount >= 30;
                case 'PowerKing':
                    return activityCount >= 30;
                default:
                    return false;
            }
        } catch (error) {
            console.error('Error checking NFT eligibility:', error);
            return false;
        }
    }

    // 添加claimNFT方法
    async claimNFT(nftId: string): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            const walletAddress = this.wallet.publicKey.toString();
            
            // 检查资格
            const isEligible = await this.checkNFTEligibility(nftId);
            if (!isEligible) {
                throw new Error('Not eligible for this NFT');
            }

            // 调用mintNFT方法
            return await this.mintNFT(walletAddress, nftId);
        } catch (error) {
            console.error('Error claiming NFT:', error);
            throw error;
        }
    }

    // 真正的NFT铸造（暂时使用localStorage模拟，后续可升级为真正的链上操作）
    async mintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            const isEligible = await this.checkNFTEligibility(nftId);
            if (!isEligible) {
                throw new Error('Not eligible for this NFT');
            }

            // 获取健康数据
            const [activities, dietaryRecords] = await Promise.all([
                this.getUserActivities(),
                this.getUserDietaryRecords()
            ]);

            const healthData: HealthData = {
                exerciseRecords: activities.length,
                dietaryRecords: dietaryRecords.length,
                totalRecords: activities.length + dietaryRecords.length
            };

            // 创建NFT元数据
            const nftMetadata: NftMetadata = {
                name: this.getNFTName(nftId),
                symbol: 'HEALTH',
                uri: `https://your-domain.com/metadata/${nftId}.json`,
                nftType: nftId
            };

            // 暂时使用localStorage模拟mint过程
            // 在实际部署时，这里应该调用智能合约的mint方法
            console.log('Minting NFT with metadata:', nftMetadata);
            console.log('Health data:', healthData);

            // 模拟链上交易延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 保存到本地存储以维护兼容性
            const ownedNFTs = localStorage.getItem(`ownedNFTs_${recipientAddress}`);
            const ownedNFTList = ownedNFTs ? JSON.parse(ownedNFTs) : [];
            if (!ownedNFTList.includes(nftId)) {
                ownedNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${recipientAddress}`, JSON.stringify(ownedNFTList));
            }

            console.log(`NFT ${nftId} successfully minted to ${recipientAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error minting NFT:', error);
            throw error;
        }
    }

    // 管理员铸造NFT
    async adminMintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        // 管理员可以绕过资格检查直接铸造
        return this.mintNFT(recipientAddress, nftId);
    }

    // 初始化用户记录
    async initializeUserRecord(): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            const [userRecordPDA] = getUserRecordPDA(this.wallet.publicKey);

            // 检查用户记录是否已存在
            const userRecordInfo = await this.connection.getAccountInfo(userRecordPDA);
            if (userRecordInfo) {
                console.log('User record already exists');
                return true;
            }

            const tx = await this.program.methods
                .initializeUserRecord()
                .accounts({
                    owner: this.wallet.publicKey,
                    userRecord: userRecordPDA,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log('User record initialized:', tx);
            return true;
        } catch (error: any) {
            console.error('Error initializing user record:', error);
            throw error;
        }
    }

    // 存入NFT到链上
    async depositNFTToChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            // 首先确保用户记录存在
            await this.initializeUserRecord();

            // 这里需要实现具体的存入逻辑
            // 对于演示，我们假设NFT已经存在并且需要标记为在链上
            const [userRecordPDA] = getUserRecordPDA(this.wallet.publicKey);
            
            // 创建一个模拟的NFT mint地址
            const nftMint = Keypair.generate().publicKey;

            const tx = await this.program.methods
                .depositNft()
                .accounts({
                    owner: this.wallet.publicKey,
                    nftMint,
                    userRecord: userRecordPDA,
                })
                .rpc();

            console.log('NFT deposited to chain:', tx);
            
            // 更新本地存储
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            if (!chainNFTList.includes(nftId)) {
                chainNFTList.push(nftId);
                localStorage.setItem(`chainNFTs_${walletAddress}`, JSON.stringify(chainNFTList));
            }

            return true;
        } catch (error: any) {
            console.error('Error depositing NFT to chain:', error);
            throw error;
        }
    }

    // 从链上接收NFT
    async receiveNFTFromChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            const [userRecordPDA] = getUserRecordPDA(this.wallet.publicKey);
            
            // 创建一个模拟的NFT mint地址
            const nftMint = Keypair.generate().publicKey;

            const tx = await this.program.methods
                .withdrawNft()
                .accounts({
                    owner: this.wallet.publicKey,
                    nftMint,
                    userRecord: userRecordPDA,
                })
                .rpc();

            console.log('NFT received from chain:', tx);
            
            // 更新本地存储
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            const updatedChainList = chainNFTList.filter((id: string) => id !== nftId);
            localStorage.setItem(`chainNFTs_${walletAddress}`, JSON.stringify(updatedChainList));

            const ownedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
            const ownedNFTList = ownedNFTs ? JSON.parse(ownedNFTs) : [];
            if (!ownedNFTList.includes(nftId)) {
                ownedNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${walletAddress}`, JSON.stringify(ownedNFTList));
            }

            return true;
        } catch (error: any) {
            console.error('Error receiving NFT from chain:', error);
            throw error;
        }
    }

    // 获取链上NFT列表
    async getChainNFTs(walletAddress: string): Promise<string[]> {
        try {
            if (!this.wallet.connected) {
                return [];
            }

            const [userRecordPDA] = getUserRecordPDA(this.wallet.publicKey);
            
            // 获取用户记录
            const userRecord = await this.program.account.userRecord.fetch(userRecordPDA);
            
            // 这里需要根据实际的NFT mint地址映射到NFT ID
            // 目前返回本地存储的数据作为备选
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            console.log('=== Chain NFTs Debug ===');
            console.log('Wallet Address:', walletAddress);
            console.log('Chain NFTs from localStorage:', chainNFTList);
            console.log('User Record PDA:', userRecordPDA.toString());
            console.log('User Record on-chain NFTs:', userRecord.onChainNfts.map((nft: any) => nft.toString()));
            console.log('=== End Chain NFTs Debug ===');
            
            return chainNFTList;
        } catch (error: any) {
            console.error('Error fetching chain NFTs:', error);
            // 回退到本地存储
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            console.log('=== Chain NFTs Debug (Error fallback) ===');
            console.log('Wallet Address:', walletAddress);
            console.log('Chain NFTs from localStorage:', chainNFTList);
            console.log('=== End Chain NFTs Debug (Error fallback) ===');
            
            return chainNFTList;
        }
    }

    // 转移NFT
    async transferNFT(nftId: string, fromAddress: string, toAddress: string): Promise<boolean> {
        try {
            if (!this.wallet.connected) {
                throw new Error('Wallet not connected');
            }

            // 这里需要实现具体的转移逻辑
            // 对于演示，我们使用本地存储来模拟
            const fromNFTs = localStorage.getItem(`ownedNFTs_${fromAddress}`);
            const fromNFTList = fromNFTs ? JSON.parse(fromNFTs) : [];
            
            if (!fromNFTList.includes(nftId)) {
                throw new Error('NFT not found in sender\'s wallet');
            }

            const updatedFromList = fromNFTList.filter((id: string) => id !== nftId);
            localStorage.setItem(`ownedNFTs_${fromAddress}`, JSON.stringify(updatedFromList));

            const toNFTs = localStorage.getItem(`ownedNFTs_${toAddress}`);
            const toNFTList = toNFTs ? JSON.parse(toNFTs) : [];
            if (!toNFTList.includes(nftId)) {
                toNFTList.push(nftId);
                localStorage.setItem(`ownedNFTs_${toAddress}`, JSON.stringify(toNFTList));
            }

            console.log(`NFT ${nftId} transferred from ${fromAddress} to ${toAddress}`);
            return true;
        } catch (error: any) {
            console.error('Error transferring NFT:', error);
            throw error;
        }
    }

    // 获取NFT名称
    private getNFTName(nftId: string): string {
        const nftNames: { [key: string]: string } = {
            '7R5percent': '5% Discount Card for 7 Records',
            '7R10percent': '10% Discount Card for 7 Records',
            '30R8percent': '8% Discount Card for 30 Records',
            '30R10percent': '10% Discount Card for 30 Records',
            'regularDiet': 'Diet Master',
            'PowerKing': 'Exercise Master'
        };
        return nftNames[nftId] || nftId;
    }

    // 获取所有NFT及其拥有状态
    async getAllNFTsWithOwnership(walletAddress: string): Promise<NFT[]> {
        const allNFTs = ALL_NFTS.map(nft => ({
            ...nft,
            isOwned: localStorage.getItem(`ownedNFTs_${walletAddress}`)?.includes(nft.id) || false,
            isEligible: this.checkEligibilitySync(nft.id, 0, 0, 0), // Placeholder, needs actual activity/dietary counts
            progress: '', // Placeholder
            currentRecords: 0 // Placeholder
        }));

        const [activities, dietaryRecords] = await Promise.all([
            this.getUserActivities(),
            this.getUserDietaryRecords()
        ]);

        const activityCount = activities.length;
        const dietaryCount = dietaryRecords.length;
        const totalRecords = activityCount + dietaryCount;

        console.log('=== NFT Data Debug ===');
        console.log('Wallet Address:', walletAddress);
        console.log('Activity Count:', activityCount);
        console.log('Dietary Count:', dietaryCount);
        console.log('Total Records:', totalRecords);

        const result = allNFTs.map(nft => {
            const isEligible = this.checkEligibilitySync(nft.id, activityCount, dietaryCount, totalRecords);
            const progress = this.getProgressString(nft.id, activityCount, dietaryCount, totalRecords);
            const currentRecords = this.getCurrentRecords(nft.id, activityCount, dietaryCount, totalRecords);
            
            console.log(`NFT ${nft.id}:`, {
                isEligible,
                progress,
                currentRecords,
                isOwned: nft.isOwned
            });
            
            return {
                ...nft,
                isEligible,
                progress,
                currentRecords
            };
        });

        console.log('=== End NFT Data Debug ===');
        return result;
    }

    private checkEligibilitySync(nftId: string, activityCount: number, dietaryCount: number, totalRecords: number): boolean {
        switch (nftId) {
            case '7R5percent':
            case '7R10percent':
                return totalRecords >= 7;
            case '30R8percent':
            case '30R10percent':
                return totalRecords >= 30;
            case 'regularDiet':
                return dietaryCount >= 30;
            case 'PowerKing':
                return activityCount >= 30;
            default:
                return false;
        }
    }

    private getProgressString(nftId: string, activityCount: number, dietaryCount: number, totalRecords: number): string {
        switch (nftId) {
            case '7R5percent':
            case '7R10percent':
                return `${totalRecords}/7 条记录已完成（运动${activityCount}+饮食${dietaryCount}）`;
            case '30R8percent':
            case '30R10percent':
                return `${totalRecords}/30 条记录已完成（运动${activityCount}+饮食${dietaryCount}）`;
            case 'regularDiet':
                return `${dietaryCount}/30 条饮食记录已完成`;
            case 'PowerKing':
                return `${activityCount}/30 条运动记录已完成`;
            default:
                return '';
        }
    }

    private getCurrentRecords(nftId: string, activityCount: number, dietaryCount: number, totalRecords: number): number {
        switch (nftId) {
            case '7R5percent':
            case '7R10percent':
            case '30R8percent':
            case '30R10percent':
                return totalRecords;
            case 'regularDiet':
                return dietaryCount;
            case 'PowerKing':
                return activityCount;
            default:
                return 0;
        }
    }

    // 获取用户NFT列表
    async getUserNFTs(walletAddress: string): Promise<string[]> {
        const ownedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
        return ownedNFTs ? JSON.parse(ownedNFTs) : [];
    }

    // 按类别过滤NFT
    filterNFTsByCategory(nfts: NFT[], category: string): NFT[] {
        if (category === 'all') return nfts;
        if (category === 'owned') return nfts.filter(nft => nft.isOwned);
        if (category === 'available') return nfts.filter(nft => !nft.isOwned);
        return nfts.filter(nft => nft.category === category);
    }
} 