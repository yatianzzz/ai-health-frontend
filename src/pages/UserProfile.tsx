import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Descriptions, Avatar, Button, Tag, Divider, Statistic, Typography, message } from 'antd';
import { UserOutlined, EditOutlined, HeartOutlined, FireOutlined, LineChartOutlined, StarOutlined } from '@ant-design/icons';
import { useUser } from '../context/UserContext';
import DashboardLayout from '../layouts/DashboardLayout';
import UserProfileForm from '../components/UserProfileForm';

const { Title, Text } = Typography;

const UserProfile: React.FC = () => {
  const { userProfile, updateUserProfile, hasShownForm, setHasShownForm, isLoading, refreshProfile } = useUser();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refresh profile when component mounts to ensure latest data
  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);



  // Remove automatic form display - only show when user clicks button

  const handleProfileUpdate = async (updatedProfile: any) => {
    try {
      setIsSubmitting(true);
      await updateUserProfile(updatedProfile);
      setEditModalVisible(false);
      setHasShownForm(true);
      message.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching profile
  if (isLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p>Loading profile...</p>
        </div>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <div>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Avatar size={80} icon={<UserOutlined />} />
            <p style={{ marginTop: 20 }}>Profile information is incomplete</p>
            <Button
              type="primary"
              onClick={() => setEditModalVisible(true)}
              loading={isSubmitting}
            >
              Complete Profile
            </Button>
          </div>
        </Card>

        <UserProfileForm
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSubmit={handleProfileUpdate}
        />
      </div>
    );
  }

  return (
    <div>
      <Card
        style={{ 
          marginBottom: 24, 
          borderRadius: 8, 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{ 
            height: 120, 
            background: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
            margin: '-24px -24px 0',
            position: 'relative'
          }}
        />
        
        <div style={{ 
          display: 'flex', 
          marginBottom: 30, 
          marginTop: -60,
          position: 'relative'
        }}>
          <Avatar 
            size={120} 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: '#1890ff',
              border: '4px solid white',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
          <div style={{ 
            marginLeft: 24, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'flex-end',
            paddingBottom: 12
          }}>
            <Title level={3} style={{ margin: 0 }}>
              {userProfile.firstName} {userProfile.lastName}
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>{userProfile.occupation}</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">Member</Tag>
              <Tag color="green">Active</Tag>
            </div>
          </div>
          
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            style={{ position: 'absolute', right: 0, bottom: 12 }}
            onClick={() => setEditModalVisible(true)}
            loading={isSubmitting}
          >
            Edit Profile
          </Button>
        </div>

        <Divider />
        
        <Title level={4}>Personal Information</Title>
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9', height: '100%' }}>
              <Statistic 
                title="Age" 
                value={userProfile.age} 
                suffix="years" 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9', height: '100%' }}>
              <Statistic 
                title="Gender" 
                value={userProfile.gender === 'male' ? 'Male' : userProfile.gender === 'female' ? 'Female' : 'Other'} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9', height: '100%' }}>
              <Statistic 
                title="Favorite Sport" 
                value={userProfile.favoriteSport} 
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />
        
        <Title level={4}>Health Data</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9' }}>
              <Statistic 
                title="BMI" 
                value={26.4} 
                precision={1}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<HeartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9' }}>
              <Statistic 
                title="Weekly Exercise" 
                value={3} 
                suffix="times"
                valueStyle={{ color: '#52c41a' }}
                prefix={<FireOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9' }}>
              <Statistic 
                title="Daily Steps" 
                value={7500} 
                valueStyle={{ color: '#1890ff' }}
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9' }}>
              <Statistic 
                title="Sleep Quality" 
                value="Good" 
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} style={{ background: '#f9f9f9' }}>
              <Statistic 
                title="Health Status" 
                value="Sub-healthy" 
                valueStyle={{ color: '#fa8c16' }}
                prefix={<StarOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <UserProfileForm 
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
};

const UserProfileWithLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <UserProfile />
    </DashboardLayout>
  );
};

export default UserProfileWithLayout; 