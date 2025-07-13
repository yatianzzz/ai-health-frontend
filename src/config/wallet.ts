import { clusterApiUrl } from '@solana/web3.js';
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_ENDPOINT = clusterApiUrl(SOLANA_NETWORK);

export const SUPPORTED_WALLETS = [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
]; 