// Demo data utility functions
export const initializeDemoData = () => {
    // Create some demo wallet addresses and NFT data
    const demoWallets = [
        '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhHpKMvMtXs',
        'BrDuFfuHdNw4pKMGdZqpM23EkqZRDpR8qGT4uTzQ3vv5',
        'CSDK4BNcVFE2K3rY7qJKgE8DdPhFeY9dKdYaQ5zHaM5v',
        'DdUfWk3CpLF9s9FpE8K3DdYkR8YYFc6gMdQVpNW23nzT'
    ];

    const demoNFTs = [
        '7R5percent',
        '7R10percent', 
        '30R8percent',
        'regularDiet',
        'PowerKing'
    ];

    // Randomly assign some NFTs to each wallet
    demoWallets.forEach(wallet => {
        // Randomly select 1-3 NFTs
        const nftCount = Math.floor(Math.random() * 3) + 1;
        const selectedNFTs: string[] = [];
        
        for (let i = 0; i < nftCount; i++) {
            const randomNFT = demoNFTs[Math.floor(Math.random() * demoNFTs.length)];
            if (!selectedNFTs.includes(randomNFT)) {
                selectedNFTs.push(randomNFT);
            }
        }
        
        // Store to localStorage
        localStorage.setItem(`ownedNFTs_${wallet}`, JSON.stringify(selectedNFTs));
    });

    console.log('Demo data initialized with:', {
        wallets: demoWallets.length,
        nftTypes: demoNFTs.length
    });
};

// Clear demo data
export const clearDemoData = () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('ownedNFTs_') || key?.startsWith('chainNFTs_')) {
            localStorage.removeItem(key);
        }
    }
    console.log('Demo data cleared');
};

// Check if demo data already exists
export const hasDemoData = (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('ownedNFTs_')) {
            return true;
        }
    }
    return false;
}; 