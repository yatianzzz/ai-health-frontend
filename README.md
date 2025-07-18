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


## License

This project is for academic and demonstration purposes. For commercial use or further development, please contact the project maintainers.
