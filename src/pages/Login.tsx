import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tabs, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/global.css';
import { login, register } from '../services/loginAPI';
import UserProfileForm, { UserProfileData } from '../components/UserProfileForm';
import { saveUserProfile } from '../services/userAPI';
import { useAuth } from '../context/AuthContext';

const { TabPane } = Tabs;

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin, isAuthenticated } = useAuth();
  
  // 如果已经登录，重定向到首页或来源页面
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const onFinishLogin = async (values: any) => {
    setIsLoading(true);
    try {
      const response = await login(values);

      if (response.code === 200) {
        message.success('Login successful!');
        console.log('Login response:', response);

        // 使用AuthContext保存登录状态
        authLogin(response.data.token, values.username);

        // 检查是否需要完善个人资料
        const isNewUser = !localStorage.getItem('profileComplete');
        if (isNewUser) {
          setShowProfileForm(true);
        } else {
          // 重定向到首页或来源页面
          const from = (location.state as any)?.from?.pathname || '/dashboard/home';
          navigate(from, { replace: true });
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onFinishRegister = async (values: any) => {
    setIsLoading(true);
    try {
      const response = await register(values);
      if (response.code === 200) {
      message.success('Registration successful! Please login.');
      console.log('Register response:', response);
      setActiveTab('login');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      message.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (profileData: UserProfileData) => {
    setIsLoading(true);
    try {
      const result = await saveUserProfile(profileData);
      
      if (result.code === 200) {
        message.success('Profile setup successful!');
        localStorage.setItem('profileComplete', 'true');
        setShowProfileForm(false);
        navigate('/dashboard/home');
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
    } catch (error: any) {
      console.error('Profile submission error:', error);
      message.error(error.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'var(--gray-light)'
    }}>
      <Card 
        style={{
          width: 400,
          boxShadow: 'var(--shadow)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24
        }}>
          <UserOutlined style={{ fontSize: 32, color: 'var(--primary-color)' }} />
          <h1 style={{ color: 'var(--primary-color)', marginLeft: 10, fontSize: 24 }}>Health Management System</h1>
        </div>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Login" key="login">
            <Form
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinishLogin}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  style={{ width: '100%' }}
                  loading={isLoading}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Register" key="register">
            <Form
              name="register_form"
              onFinish={onFinishRegister}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please enter your username!' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  style={{ width: '100%' }}
                  loading={isLoading}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      <UserProfileForm 
        visible={showProfileForm}
        onClose={() => {}} // Don't allow closing
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
};

export default Login;