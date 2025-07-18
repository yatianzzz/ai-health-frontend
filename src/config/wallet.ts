import { clusterApiUrl } from '@solana/web3.js';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const SOLANA_NETWORK = WalletAdapterNetwork.Devnet;
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

export const getWalletAdapters = () => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new TorusWalletAdapter(),
    new LedgerWalletAdapter(),
];

// 添加缺少的SUPPORTED_WALLETS导出
export const SUPPORTED_WALLETS = [
    'Phantom',
    'Solflare',
    'Torus',
    'Ledger'
];

export const COMMITMENT = 'confirmed';
export const PREFLIGHT_COMMITMENT = 'processed'; 