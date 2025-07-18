import { PublicKey, Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, setProvider } from '@project-serum/anchor';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 部署配置
const NETWORK = 'devnet';
const RPC_URL = clusterApiUrl(NETWORK);
const PROGRAM_DIR = './src/programs/health-nft';
const PROGRAM_NAME = 'health_nft';

async function deployProgram() {
    console.log('🚀 开始部署Health NFT程序到Solana devnet...');
    console.log('=' .repeat(50));
    
    try {
        // 1. 检查环境
        console.log('1️⃣ 检查部署环境...');
        await checkEnvironment();
        
        // 2. 连接到Solana devnet
        console.log('2️⃣ 连接到Solana devnet...');
        const connection = new Connection(RPC_URL, 'confirmed');
        console.log('✅ 已连接到Solana devnet');

        // 3. 加载钱包
        console.log('3️⃣ 加载钱包...');
        const wallet = loadWallet();
        console.log('✅ 钱包地址:', wallet.publicKey.toString());

        // 4. 检查钱包余额
        console.log('4️⃣ 检查钱包余额...');
        const balance = await connection.getBalance(wallet.publicKey);
        console.log('💰 钱包余额:', balance / 1e9, 'SOL');

        if (balance < 0.5e9) { // 少于0.5 SOL
            console.log('⚠️ 钱包余额不足，正在申请空投...');
            await requestAirdrop(connection, wallet.publicKey);
        }

        // 5. 创建Provider
        console.log('5️⃣ 创建Anchor Provider...');
        const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'processed' });
        setProvider(provider);

        // 6. 编译程序
        console.log('6️⃣ 编译程序...');
        await compileProgram();

        // 7. 部署程序
        console.log('7️⃣ 部署程序...');
        const programId = await deployProgramWithAnchor();
        console.log('✅ 程序部署成功！');
        console.log('🆔 程序ID:', programId.toString());

        // 8. 更新前端配置
        console.log('8️⃣ 更新前端配置...');
        await updateFrontendConfig(programId);
        console.log('✅ 前端配置已更新');

        // 9. 运行基本测试
        console.log('9️⃣ 运行基本测试...');
        await runBasicTests(programId, provider);

        // 10. 生成部署报告
        console.log('🔟 生成部署报告...');
        await generateDeploymentReport(programId, wallet.publicKey);

        console.log('=' .repeat(50));
        console.log('🎉 部署完成！');
        console.log('📝 程序ID:', programId.toString());
        console.log('🌐 浏览器查看: https://explorer.solana.com/address/' + programId.toString() + '?cluster=devnet');
        console.log('📱 现在可以在前端页面测试NFT功能了！');

    } catch (error) {
        console.error('❌ 部署失败:', error);
        process.exit(1);
    }
}

async function checkEnvironment(): Promise<void> {
    try {
        // 检查Solana CLI
        await execAsync('solana --version');
        console.log('✅ Solana CLI 已安装');

        // 检查Anchor
        await execAsync('anchor --version');
        console.log('✅ Anchor框架已安装');

        // 检查Rust
        await execAsync('rustc --version');
        console.log('✅ Rust编译器已安装');

        // 检查程序目录
        const programPath = join(process.cwd(), PROGRAM_DIR);
        try {
            readFileSync(join(programPath, 'Cargo.toml'), 'utf8');
            console.log('✅ 程序目录结构正确');
        } catch (error) {
            throw new Error(`程序目录不存在或结构不正确: ${programPath}`);
        }

    } catch (error) {
        console.error('❌ 环境检查失败:', error);
        throw error;
    }
}

function loadWallet(): Wallet {
    const walletPaths = [
        process.env.SOLANA_WALLET_PATH,
        join(process.env.HOME || '~', '.config/solana/id.json'),
        join(process.env.HOME || '~', '.config/solana/devnet.json')
    ];

    for (const walletPath of walletPaths) {
        if (walletPath) {
            try {
                const keypairData = JSON.parse(readFileSync(walletPath, 'utf8'));
                const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
                return new Wallet(keypair);
            } catch (error) {
                console.log(`⚠️ 无法加载钱包文件: ${walletPath}`);
            }
        }
    }

    console.error('❌ 无法找到钱包文件');
    console.log('💡 请创建钱包:');
    console.log('   solana-keygen new --outfile ~/.config/solana/id.json');
    process.exit(1);
}

async function requestAirdrop(connection: Connection, publicKey: PublicKey): Promise<void> {
    try {
        console.log('💰 请求空投...');
        const airdropSignature = await connection.requestAirdrop(publicKey, 2e9); // 2 SOL
        await connection.confirmTransaction(airdropSignature);
        
        const newBalance = await connection.getBalance(publicKey);
        console.log('✅ 空投成功，当前余额:', newBalance / 1e9, 'SOL');
    } catch (error) {
        console.error('❌ 空投失败:', error);
        throw error;
    }
}

async function compileProgram(): Promise<void> {
    try {
        console.log('🔨 清理之前的编译缓存...');
        await execAsync('anchor clean', { cwd: PROGRAM_DIR });
        
        console.log('🔨 编译程序...');
        const { stdout, stderr } = await execAsync('anchor build', { cwd: PROGRAM_DIR });
        
        if (stderr) {
            console.log('⚠️ 编译警告:', stderr);
        }
        
        console.log('✅ 程序编译成功');
    } catch (error) {
        console.error('❌ 编译失败:', error);
        throw error;
    }
}

async function deployProgramWithAnchor(): Promise<PublicKey> {
    try {
        const { stdout } = await execAsync('anchor deploy --provider.cluster devnet', { cwd: PROGRAM_DIR });
        console.log('Anchor deploy output:', stdout);
        
        // 从输出中解析程序ID
        const programIdMatch = stdout.match(/Program Id: ([A-Za-z0-9]{44})/);
        if (!programIdMatch) {
            throw new Error('无法从部署输出中解析程序ID');
        }
        
        return new PublicKey(programIdMatch[1]);
    } catch (error) {
        console.error('❌ 部署失败:', error);
        throw error;
    }
}

async function updateFrontendConfig(programId: PublicKey): Promise<void> {
    try {
        const configPath = './src/contracts/nft.ts';
        let configContent = readFileSync(configPath, 'utf8');
        
        // 更新程序ID
        configContent = configContent.replace(
            /export const NFT_PROGRAM_ID = new PublicKey\('.*?'\);/,
            `export const NFT_PROGRAM_ID = new PublicKey('${programId.toString()}');`
        );
        
        writeFileSync(configPath, configContent);
        console.log('✅ 前端配置已更新');
    } catch (error) {
        console.error('❌ 更新前端配置失败:', error);
        throw error;
    }
}

async function runBasicTests(programId: PublicKey, provider: AnchorProvider): Promise<void> {
    try {
        console.log('🧪 测试程序账户信息...');
        const accountInfo = await provider.connection.getAccountInfo(programId);
        if (!accountInfo) {
            throw new Error('程序账户不存在');
        }
        console.log('✅ 程序账户存在');

        console.log('🧪 测试程序加载...');
        const idlPath = join(PROGRAM_DIR, 'target/idl/health_nft.json');
        const idl = JSON.parse(readFileSync(idlPath, 'utf8'));
        const program = new Program(idl, programId, provider);
        console.log('✅ 程序加载成功');

        console.log('🧪 测试网络连接...');
        const latestBlockHash = await provider.connection.getLatestBlockhash();
        console.log('✅ 网络连接正常，最新区块高度:', latestBlockHash.blockhash);

        console.log('✅ 所有基本测试通过');
    } catch (error) {
        console.error('❌ 测试失败:', error);
        throw error;
    }
}

async function generateDeploymentReport(programId: PublicKey, walletPublicKey: PublicKey): Promise<void> {
    const report = {
        deploymentTime: new Date().toISOString(),
        network: NETWORK,
        programId: programId.toString(),
        walletAddress: walletPublicKey.toString(),
        explorerUrl: `https://explorer.solana.com/address/${programId.toString()}?cluster=devnet`,
        frontendUrl: 'http://localhost:3000',
        instructions: [
            '1. 启动前端服务: npm start',
            '2. 在浏览器中打开 http://localhost:3000',
            '3. 连接钱包进行测试',
            '4. 导航到NFT激励页面测试功能'
        ]
    };

    const reportPath = './deployment-report.json';
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log('✅ 部署报告已生成:', reportPath);
}

// 主函数
if (require.main === module) {
    deployProgram().catch(console.error);
}

export { deployProgram }; 