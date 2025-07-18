import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import enUS from 'antd/lib/locale/en_US';

// Wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { getWalletAdapters, SOLANA_NETWORK, SOLANA_RPC_ENDPOINT } from './config/wallet';

// Wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

import Login from './pages/Login';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import ExercisePage from './pages/ExercisePage';
import UserProfileWithLayout from './pages/UserProfile';
import Diet from './pages/Diet';
import MentalHealthSupport from './pages/MentalHealthSupport';
import MentalHealthAssessment from './pages/MentalHealthAssessment';
import MentalHealthChat from './pages/MentalHealthChat';
import NFTIncentive from './pages/NFTIncentive';
import NFTAdmin from './pages/NFTAdmin';
import './styles/global.css';
import { UserProvider } from './context/UserContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { DietProvider } from './context/DietContext';
import { MentalHealthProvider } from './context/MentalHealthContext';

const App: React.FC = () => {
  const wallets = getWalletAdapters();

  return (
    <ConnectionProvider endpoint={SOLANA_RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ConfigProvider locale={enUS}>
            <AuthProvider>
              <UserProvider>
                <ExerciseProvider>
                  <DietProvider>
                    <MentalHealthProvider>
                      <Router>
                        <Routes>
                          <Route path="/login" element={<Login />} />
                          <Route path="/dashboard/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                          <Route path="/dashboard/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
                          <Route path="/dashboard/diet" element={<ProtectedRoute><Diet /></ProtectedRoute>} />
                          <Route path="/dashboard/exercise" element={<ProtectedRoute><ExercisePage /></ProtectedRoute>} />
                          <Route path="/dashboard/mental-health" element={<ProtectedRoute><MentalHealthSupport /></ProtectedRoute>} />
                          <Route path="/dashboard/mental-health/assessment" element={<ProtectedRoute><MentalHealthAssessment /></ProtectedRoute>} />
                          <Route path="/dashboard/mental-health/assessment/:category" element={<ProtectedRoute><MentalHealthAssessment /></ProtectedRoute>} />
                          <Route path="/dashboard/mental-health/chat" element={<ProtectedRoute><MentalHealthChat /></ProtectedRoute>} />
                          <Route path="/dashboard/system" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                          <Route path="/dashboard/nft-incentive" element={<ProtectedRoute><NFTIncentive /></ProtectedRoute>} />
                          <Route path="/dashboard/nft-admin" element={<ProtectedRoute><NFTAdmin /></ProtectedRoute>} />
                          <Route path="/dashboard/profile" element={<ProtectedRoute><UserProfileWithLayout /></ProtectedRoute>} />
                          <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
                          <Route path="*" element={<Navigate to="/login" replace />} />
                        </Routes>
                      </Router>
                    </MentalHealthProvider>
                  </DietProvider>
                </ExerciseProvider>
              </UserProvider>
            </AuthProvider>
          </ConfigProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;