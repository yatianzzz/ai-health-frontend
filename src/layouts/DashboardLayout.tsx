import React, { useState } from 'react';
import { Layout, Menu, Avatar, Badge, Input, Button, Dropdown, message } from 'antd';
import { 
  HomeOutlined, AppleOutlined, FireOutlined, SmileOutlined,
  SettingOutlined, UserOutlined, SearchOutlined, LogoutOutlined, DownOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/loginAPI';
import Notifications from '../components/Notifications';
import './dashboardLayout.css';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useUser();
  const { username } = useAuth();
  
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/home')) return '1';
    if (path.includes('/dashboard/diet')) return '2';
    if (path.includes('/dashboard/exercise')) return '3';
    if (path.includes('/dashboard/mental-health')) return '4';
    if (path.includes('/dashboard/settings')) return '5';
    return '1'; // Default to home
  };
  
  const handleMenuClick = (key: string) => {
    switch(key) {
      case '1':
        navigate('/dashboard/home');
        break;
      case '2':
        navigate('/dashboard/diet');
        break;
      case '3':
        navigate('/dashboard/exercise');
        break;
      case '4':
        navigate('/dashboard/mental-health');
        break;
      case '5':
        navigate('/dashboard/settings');
        break;
      default:
        navigate('/dashboard/home');
    }
  };

  const goToProfile = () => {
    navigate('/dashboard/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed');
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/dashboard/profile')}>
        <UserOutlined /> Profile
      </Menu.Item>
      <Menu.Item key="settings" onClick={() => navigate('/dashboard/settings')}>
        <SettingOutlined /> Settings
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        width={300}
        collapsedWidth={80}
        style={{ 
          backgroundColor: 'var(--primary-color)',
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '16px', 
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '10px'
          }}>
            <UserOutlined style={{ color: 'var(--primary-color)', fontSize: '24px' }} />
          </div>
          {!collapsed && <span>Health Management System</span>}
        </div>
        
        {!collapsed && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '8px',
            cursor: 'pointer'
          }} onClick={goToProfile}>
            <Avatar size={40} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
            <div style={{ marginLeft: '12px', color: 'white' }}>
              <div style={{ fontWeight: '500' }}>
                {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
              </div>
              <div style={{ fontSize: '12px', opacity: '0.8' }}>
                {userProfile ? userProfile.occupation : 'Student'}
              </div>
            </div>
          </div>
        )}
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ backgroundColor: 'var(--primary-color)' }}
          onClick={(e) => handleMenuClick(e.key)}
          items={[
            { key: '1', icon: <HomeOutlined />, label: 'Home' },
            { key: '2', icon: <AppleOutlined />, label: 'Dietary Suggestions' },
            { key: '3', icon: <FireOutlined />, label: 'Exercise Guidance' },
            { key: '4', icon: <SmileOutlined />, label: 'Mental Health Support' },
            { key: '5', icon: <SettingOutlined />, label: 'Settings' },
          ]}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 300, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: 'var(--white)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow)'
        }}>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search..." 
            style={{ width: 300, borderRadius: 20 }} 
          />
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 24 }}>
              <Notifications />
            </div>
            
            <div className="header-right">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <span className="user-dropdown-link">
              <Avatar icon={<UserOutlined />} />
                  <span className="username">{username || 'User'}</span>
                  <DownOutlined />
                </span>
              </Dropdown>
            </div>
          </div>
        </Header>
        
        <Content style={{ margin: '16px', padding: '20px', background: 'var(--white)' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 