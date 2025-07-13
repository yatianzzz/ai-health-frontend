// 演示数据工具函数
export const initializeDemoData = () => {
    // 创建一些演示用的钱包地址和NFT数据
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

    // 为每个钱包随机分配一些NFT
    demoWallets.forEach(wallet => {
        // 随机选择1-3个NFT
        const nftCount = Math.floor(Math.random() * 3) + 1;
        const selectedNFTs: string[] = [];
        
        for (let i = 0; i < nftCount; i++) {
            const randomNFT = demoNFTs[Math.floor(Math.random() * demoNFTs.length)];
            if (!selectedNFTs.includes(randomNFT)) {
                selectedNFTs.push(randomNFT);
            }
        }
        
        // 存储到localStorage
        localStorage.setItem(`ownedNFTs_${wallet}`, JSON.stringify(selectedNFTs));
    });

    console.log('Demo data initialized with:', {
        wallets: demoWallets.length,
        nftTypes: demoNFTs.length
    });
};

// 清理演示数据
export const clearDemoData = () => {
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith('ownedNFTs_') || key?.startsWith('chainNFTs_')) {
            localStorage.removeItem(key);
        }
    }
    console.log('Demo data cleared');
};

// 检查是否已有演示数据
export const hasDemoData = (): boolean => {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('ownedNFTs_')) {
            return true;
        }
    }
    return false;
}; 