import React from 'react';
import { Button, Space, Typography } from 'antd';
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

const { Text } = Typography;

export const WalletConnect: React.FC = () => {
    const { connected, publicKey, disconnect } = useWallet();
    const { setVisible } = useWalletModal();

    const handleConnect = () => {
        setVisible(true);
    };

    const handleDisconnect = () => {
        disconnect();
    };

    return (
        <Space>
            {connected ? (
                <>
                    <Text type="secondary">
                        {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                    </Text>
                    <Button
                        icon={<DisconnectOutlined />}
                        onClick={handleDisconnect}
                        type="default"
                        size="small"
                    >
                        断开连接
                    </Button>
                </>
            ) : (
                <Button
                    icon={<WalletOutlined />}
                    onClick={handleConnect}
                    type="primary"
                    size="small"
                >
                    连接钱包
                </Button>
            )}
        </Space>
    );
}; 