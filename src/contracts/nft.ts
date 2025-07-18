import { Program, AnchorProvider, Idl, BN } from '@project-serum/anchor';
import { PublicKey, Connection, Keypair } from '@solana/web3.js';
import idl from '../programs/health-nft/idl/health_nft.json';

// 从IDL文件中读取的program ID，在实际部署时需要替换为真实的program ID
export const NFT_PROGRAM_ID = new PublicKey('92Pjex4KpuAx5kLu58ke2aZZhB8yq3Zfa1j6hY8Q4sVE');

export interface NftMetadata {
    name: string;
    symbol: string;
    uri: string;
    nftType: string;
}

export interface HealthData {
    exerciseRecords: number;
    dietaryRecords: number;
    totalRecords: number;
}

export interface HealthRecord {
    owner: PublicKey;
    nftMint: PublicKey;
    nftType: string;
    healthData: HealthData;
    createdAt: BN;
}

export interface UserRecord {
    owner: PublicKey;
    onChainNfts: PublicKey[];
    createdAt: BN;
}

// 简化的NFT Program类型定义
export type HealthNFTProgram = Program<Idl>;

// 获取NFT程序实例
export const getNFTProgram = (provider: AnchorProvider): HealthNFTProgram => {
    const program = new Program(idl as Idl, NFT_PROGRAM_ID, provider);
    return program;
};

// 获取用户记录的PDA
export const getUserRecordPDA = (userPubkey: PublicKey): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('user_record'), userPubkey.toBuffer()],
        NFT_PROGRAM_ID
    );
};

// 获取NFT元数据地址
export const getMetadataAddress = (mint: PublicKey): PublicKey => {
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    return PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        METADATA_PROGRAM_ID
    )[0];
};

// 获取Master Edition地址
export const getMasterEditionAddress = (mint: PublicKey): PublicKey => {
    const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    return PublicKey.findProgramAddressSync(
        [Buffer.from('metadata'), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
        METADATA_PROGRAM_ID
    )[0];
}; 