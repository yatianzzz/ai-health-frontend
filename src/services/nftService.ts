import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { NFTProgram } from '../contracts/nft';
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

// Health management related NFT list
export const availableNFTs: NFT[] = [
    {
        id: '7R5percent',
        name: '7 Records 5% Discount Card',
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
        name: '7 Records 10% Discount Card',
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
        name: '30 Records 8% Discount Card',
        frontImage: '/30R8percent/front.png',
        backImage: '/30R8percent/back.png',
        description: 'Complete 30 consistent health records (exercise + diet) to get 8% purchase discount. Front shows record progress, back shows discount benefits.',
        progress: '0/30 records completed',
        isOwned: false,
        category: 'discount',
        requiredRecords: 30,
        currentRecords: 0,
        isEligible: false
    },
    {
        id: '30R10percent',
        name: '30 Records 10% Discount Card',
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
        description: 'Complete 30 dietary records, master regular eating habits, and get nutrition expert certification. Front shows dietary habit tracking, back shows professional certification.',
        progress: '0/30 dietary records completed',
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
        description: 'Complete 30 exercise records, reach top fitness level, and get the Exercise Master title. Front shows strength training progress, back shows royal honor.',
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
    private program: NFTProgram;
    private provider: AnchorProvider;

    constructor(connection: Connection, program: NFTProgram, provider: AnchorProvider) {
        this.connection = connection;
        this.program = program;
        this.provider = provider;
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
                console.log(`Retrieved ${activities.length} user activity records:`, activities);
                return activities;
            } else {
                throw new Error(response.data.message || 'Failed to get user activity records');
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
                console.log(`Retrieved ${records.length} dietary records:`, records);
                return records;
            } else {
                throw new Error(response.data.message || 'Failed to get dietary records');
            }
        } catch (error: any) {
            console.error('Error fetching user dietary records:', error?.message || 'Unknown error');
            console.error('Full error:', error);
            return [];
        }
    }

    // Check NFT eligibility
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
                console.log(`${nft.id} discount card check: required ${requiredRecords} records, exercise ${userActivities.length} + diet ${userDietaryRecords.length} = total ${totalRecords} records`);
                return totalRecords >= requiredRecords;
            }

            // For achievement certificate NFTs, check specific type records
            if (nft.id === 'regularDiet') {
                // Diet Master: requires 30 dietary records
                console.log(`Diet Master check: requires ${requiredRecords} dietary records, currently has ${userDietaryRecords.length} records`);
                return userDietaryRecords.length >= requiredRecords;
            }

            if (nft.id === 'PowerKing') {
                // Exercise Master: requires 30 exercise records
                console.log(`Exercise Master check: requires ${requiredRecords} exercise records, currently has ${userActivities.length} records`);
                return userActivities.length >= requiredRecords;
            }

            // Other types of NFTs, return false for now
            return false;
        } catch (error: any) {
            console.error('Error checking NFT eligibility:', error?.message || 'Unknown error');
            return false;
        }
    }

    // Query user's NFTs
    async getUserNFTs(walletAddress: string): Promise<string[]> {
        try {
            const userPublicKey = new PublicKey(walletAddress);
            // This should call the actual on-chain query
            // For now, return mock data, will need to connect to smart contract for actual deployment
            const mockOwnedNFTs = localStorage.getItem(`ownedNFTs_${walletAddress}`);
            return mockOwnedNFTs ? JSON.parse(mockOwnedNFTs) : [];
        } catch (error: any) {
            console.error('Error fetching user NFTs:', error?.message || 'Unknown error');
            return [];
        }
    }

    // Mint NFT to specified address
    async mintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        try {
            // Validate NFT ID
            const nftExists = availableNFTs.some(nft => nft.id === nftId);
            if (!nftExists) {
                throw new Error(`NFT ID "${nftId}" does not exist`);
            }

            // Check if user is eligible to get this NFT
            const isEligible = await this.checkNFTEligibility(nftId);
            if (!isEligible) {
                throw new Error('You have not met the conditions to obtain this NFT');
            }

            // Temporarily use localStorage to simulate minting process
            // For actual deployment, call smart contract
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

    // Admin version of Mint NFT - does not check eligibility conditions
    async adminMintNFT(recipientAddress: string, nftId: string): Promise<boolean> {
        try {
            // Validate NFT ID
            const nftExists = availableNFTs.some(nft => nft.id === nftId);
            if (!nftExists) {
                throw new Error(`NFT ID "${nftId}" does not exist`);
            }

            // Admin minting does not require eligibility check
            // Temporarily use localStorage to simulate minting process
            // For actual deployment, call smart contract
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

    // Get all NFTs, and mark owned NFTs and eligibility status
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
                    // Discount NFT: total exercise + diet records
                    currentRecords = userActivities.length + userDietaryRecords.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} records completed (exercise ${userActivities.length} + diet ${userDietaryRecords.length})`;
                } else if (nft.id === 'regularDiet') {
                    // Diet Master: only count dietary records
                    currentRecords = userDietaryRecords.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} dietary records completed`;
                } else if (nft.id === 'PowerKing') {
                    // Exercise Master: only count exercise records
                    currentRecords = userActivities.length;
                    isEligible = currentRecords >= (nft.requiredRecords || 0);
                    progressText = isOwned 
                        ? 'Obtained' 
                        : `${currentRecords}/${nft.requiredRecords} exercise records completed`;
                } else {
                    // Other types of NFTs
                    currentRecords = 0;
                    isEligible = false;
                    progressText = nft.progress || 'Conditions not yet open';
                }
                
                console.log(`NFT ${nft.id}: requires ${nft.requiredRecords} records, currently has ${currentRecords}, eligibility status: ${isEligible}`);
                
                return {
                    ...nft,
                    isOwned,
                    isEligible,
                    currentRecords,
                    progress: progressText
                };
            });
        } catch (error: any) {
            console.error('Error getting NFTs with ownership:', error?.message || 'Unknown error');
            return availableNFTs;
        }
    }

    // Filter NFTs by category
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

    // Integrate with health management system: update NFT status based on user health data
    updateNFTProgressByHealthData(userHealthData: any): void {
        // Here you can update the progress of NFTs based on the user's health data
        // For example, update the status of corresponding NFTs based on continuous exercise days, dietary records, etc.
        console.log('Updating NFT progress based on health data:', userHealthData);
    }

    // Wallet interaction functions - deposit NFT to chain
    async depositNFTToChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            // Check if user owns this NFT
            const ownedNFTs = await this.getUserNFTs(walletAddress);
            if (!ownedNFTs.includes(nftId)) {
                throw new Error('You do not own this NFT');
            }

            // For actual deployment, call smart contract to deposit NFT to chain
            // Temporarily use simulation
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

    // Wallet interaction functions - receive NFT from chain
    async receiveNFTFromChain(nftId: string, walletAddress: string): Promise<boolean> {
        try {
            // Check if NFT is on the chain
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            const chainNFTList = chainNFTs ? JSON.parse(chainNFTs) : [];
            
            if (!chainNFTList.includes(nftId)) {
                throw new Error('NFT not found on chain');
            }

            // For actual deployment, call smart contract to receive NFT from chain
            // Temporarily use simulation
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

    // Get list of NFTs on the chain
    async getChainNFTs(walletAddress: string): Promise<string[]> {
        try {
            // For actual deployment, call smart contract to query NFTs on the chain
            // Temporarily use simulation
            const chainNFTs = localStorage.getItem(`chainNFTs_${walletAddress}`);
            return chainNFTs ? JSON.parse(chainNFTs) : [];
        } catch (error: any) {
            console.error('Error fetching chain NFTs:', error?.message || 'Unknown error');
            return [];
        }
    }

    // Transfer NFT to another address
    async transferNFT(nftId: string, fromAddress: string, toAddress: string): Promise<boolean> {
        try {
            // Check if sender owns this NFT
            const ownedNFTs = await this.getUserNFTs(fromAddress);
            if (!ownedNFTs.includes(nftId)) {
                throw new Error('You do not own this NFT');
            }

            // For actual deployment, call smart contract for transfer
            // Temporarily use simulation
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