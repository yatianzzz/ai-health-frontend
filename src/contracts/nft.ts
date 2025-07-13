import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

// NFT Program ID - 在实际部署时需要替换为真实的program ID
export const NFT_PROGRAM_ID = new PublicKey('11111111111111111111111111111111');

// NFT Program interface
export interface NFTProgram extends Program<Idl> {
    // 在这里定义NFT程序的方法
}

// 获取NFT程序实例
export const getNFTProgram = (provider: AnchorProvider): NFTProgram => {
    // 暂时返回一个模拟的程序实例
    // 在实际部署时，需要加载真实的IDL和程序
    return {
        methods: {},
        account: {},
        instruction: {},
        rpc: {},
        simulate: {},
        transaction: {},
        provider,
        programId: NFT_PROGRAM_ID,
        idl: {} as Idl,
        coder: {} as any,
        // 添加 Program 类型需要的私有属性
        _programId: NFT_PROGRAM_ID,
        _idl: {} as Idl,
        _coder: {} as any,
        _provider: provider,
        addEventListener: () => {},
        removeEventListener: () => {},
        removeAllListeners: () => {},
    } as unknown as NFTProgram;
}; 