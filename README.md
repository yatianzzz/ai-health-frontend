# AI Health Management System (Frontend)

## Overview

AI Health Management System is a modern, interactive web application designed to help users manage their health comprehensively. The system integrates exercise tracking, dietary management, mental health support, and a unique NFT-based incentive mechanism. By combining AI-driven recommendations, data visualization, and blockchain technology, the platform aims to motivate users to develop healthy habits and reward their progress.

## Features

- **Exercise Management**
  - Logging of daily exercise data (steps, duration, calories, heart rate, etc.)
  - Weekly exercise summary and visualizations
  - AI-powered exercise assistant and personalized recommendations

- **Dietary Management**
  - Input of daily food intake and calories
  - Nutrition analysis and calorie statistics
  - Visual charts for dietary trends and food category breakdowns

- **Mental Health Support**
  - AI chat for mental health advice
  - Self-assessment tools for mood and stress

- **NFT Incentive System**
  - Earn NFT rewards by completing health records
  - NFT wallet integration and blockchain interactions (mint, transfer, store)
  - Admin panel for NFT management and statistics

- **User Profile**
  - Personal information management (age, gender, occupation, favorite sport, etc.)
  - Health data overview (BMI, weekly exercise, daily steps)
  - Achievement and reward display

## Project Structure

```
ai-health-frontend/
├── public/                # Static assets (images, icons, NFT resources)
├── src/                   # Source code
│   ├── components/        # UI components
│   ├── context/           # React context for state management
│   ├── contracts/         # Blockchain contract interaction
│   ├── layouts/           # Layout components
│   ├── pages/             # Main application pages
│   ├── services/          # API and backend service calls
│   ├── styles/            # Global and component styles
│   ├── utils/             # Utility functions and demo data
│   └── App.tsx, index.tsx # App entry points
├── package.json           # Project dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher

### Technical Architecture

- Front end framework React 18+TypeScript 4.9.5
- UI Component Library Ant Design 5.26.0
- 3D Graphics Rendering: Three.js+React Three Fiber
- Chart Visualization @ ant-design/charts 2.2.7
- Style Management Styled Components 6.1.17

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm start
```

### Building for Production

```bash
npm run build
```

## NFT Incentive System

- **User Side**
  - View available and earned NFTs on the "NFT Incentive" page
  - Connect wallet for full blockchain features
  - Earn NFTs by completing exercise and dietary records
  - Interact with NFTs: mint, store on-chain, receive, transfer

- **Admin Side**
  - Access "NFT Admin" page with admin credentials
  - Mint NFTs for users, view statistics, manage user NFTs, initialize demo data


## Solana & NFT Development Setup

### 1. Install Solana CLI

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
```

After installation, you should see output similar to:

```
Installed Versions:
Rust: rustc 1.86.0
Solana CLI: solana-cli 2.2.12
Anchor CLI: anchor-cli 0.31.1
Node.js: v23.11.0
Yarn: 1.22.1
```

### 2. Generate a New Wallet

```bash
solana-keygen new --outfile ~/.config/solana/id.json
```

### 3. View Wallet Address

```bash
solana-keygen pubkey ~/.config/solana/id.json
```

### 4. Set Default Wallet

```bash
solana config set --keypair ~/.config/solana/id.json
```

### 5. Configure Devnet

```bash
solana config set --url https://api.devnet.solana.com
solana config get
```

### 6. Get Test Tokens

```bash
solana airdrop 2
solana balance
```

### 7. Install Project Dependencies

```bash
npm install
```

### 8. Smart Contract Development

#### a. Generate Program Keypair and Get Program ID

```bash
solana-keygen new --outfile target/deploy/nft_marketplace-keypair.json
solana-keygen pubkey target/deploy/nft_marketplace-keypair.json
```

#### b. Update Anchor.toml

Example:

```toml
[features]
seeds = false
skip-lint = false

[programs.devnet]
nft_marketplace = "<Your Program ID>"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
```

### 9. Frontend Dependencies for Solana

```bash
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @coral-xyz/anchor
```

### 10. Build, Test, and Deploy

#### a. Build the Program

```bash
anchor build
```

#### b. Run Tests

```bash
anchor test
```

#### c. Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

#### d. Verify Deployment

```bash
solana program show <Your Program ID> --url devnet
```

### 11. Common Commands Reference

```bash
# View Solana config
solana config get

# Check balance
solana balance

# Request test SOL
airdrop 2

# Build Anchor project
anchor build

# Test Anchor project
anchor test

# Deploy program
anchor deploy

# View program logs
solana logs <Your Program ID>

# Upgrade program
anchor upgrade <Your Program ID>
```

## License

This project is for academic and demonstration purposes. For commercial use or further development, please contact the project maintainers.
