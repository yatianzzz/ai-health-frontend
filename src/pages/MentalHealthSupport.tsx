import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Divider, Statistic, Progress } from 'antd';
import {
  HeartOutlined,
  MessageOutlined,
  UserOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMentalHealth } from '../context/MentalHealthContext';

const { Title, Paragraph } = Typography;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const AssessmentCard = styled(StyledCard)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const ChatCard = styled(StyledCard)`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const CategoryCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MentalHealthSupport: React.FC = () => {
  const navigate = useNavigate();
  const { mentalHealthData } = useMentalHealth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mental Health Assessment Categories
  const assessmentCategories = [
    {
      id: 'mental',
      title: 'Mental Health Assessment',
      description: 'Comprehensive evaluation of your current mental health status',
      icon: <SmileOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'Evaluate your current stress level and coping ability',
      icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#ff7875' }} />,
      color: '#ff7875',
      image: '/api/placeholder/150/100'
    },
    {
      id: 'anxiety',
      title: 'Anxiety Assessment',
      description: 'Evaluate your anxiety levels and identify potential triggers',
      icon: <HeartOutlined style={{ fontSize: '24px', color: '#ffa940' }} />,
      color: '#ffa940',
      image: '/api/placeholder/150/100'
    }
  ];

  const handleAssessmentClick = () => {
    navigate('/dashboard/mental-health/assessment');
  };

  const handleChatClick = () => {
    navigate('/dashboard/mental-health/chat');
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/dashboard/mental-health/assessment/${categoryId}`);
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
            <SmileOutlined style={{ marginRight: '12px' }} />
            Mental Health Support
          </Title>
          <Paragraph style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Through scientific mental health assessments and AI intelligent dialogue, we provide professional mental health support and personalized recommendations
          </Paragraph>
        </div>

        {/* Mental Health Status Display */}
        <Card
          title={<Title level={3} style={{ margin: 0, color: '#1890ff' }}>Current Mental Health Status</Title>}
          style={{
            marginBottom: '32px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)'
          }}
        >
          <Row gutter={[24, 24]}>
            <Col span={8}>
              <Card
                size="small"
                title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Comprehensive Evaluation</span>}
                style={{
                  textAlign: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  background: '#fff'
                }}
              >
                <Statistic
                  value={mentalHealthData.comprehensiveEvaluation}
                  valueStyle={{
                    color: mentalHealthData.comprehensiveEvaluation === 'Stable' ? '#52c41a' :
                           mentalHealthData.comprehensiveEvaluation === 'Unstable' ? '#f5222d' : '#666',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: mentalHealthData.comprehensiveEvaluation === 'Stable' ? '#52c41a' :
                               mentalHealthData.comprehensiveEvaluation === 'Unstable' ? '#f5222d' : '#d9d9d9'
                  }} />
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Stress Index</span>}
                style={{
                  textAlign: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  background: '#fff'
                }}
              >
                <Statistic
                  value={mentalHealthData.stressIndex}
                  suffix={mentalHealthData.stressIndex !== '--' ? '/100' : ''}
                  valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                />
                <div style={{ marginTop: '8px' }}>
                  <Progress
                    percent={mentalHealthData.stressIndex !== '--' ? Number(mentalHealthData.stressIndex) : 0}
                    showInfo={false}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    size="small"
                  />
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title={<span style={{ fontSize: '16px', fontWeight: 'bold' }}>Today's Mood</span>}
                style={{
                  textAlign: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  background: '#fff'
                }}
              >
                <Statistic
                  value={mentalHealthData.todaysMood}
                  valueStyle={{
                    color: mentalHealthData.todaysMood === 'Very good' ? '#52c41a' :
                           mentalHealthData.todaysMood === 'Good' ? '#1890ff' :
                           mentalHealthData.todaysMood === 'Sad' ? '#fa8c16' :
                           mentalHealthData.todaysMood === 'Depressed' ? '#f5222d' : '#666',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                />
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {mentalHealthData.todaysMood === 'Very good' ? '😊' :
                     mentalHealthData.todaysMood === 'Good' ? '🙂' :
                     mentalHealthData.todaysMood === 'Sad' ? '😔' :
                     mentalHealthData.todaysMood === 'Depressed' ? '😢' : '😐'}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Main Function Entries */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          <Col xs={24} md={12}>
            <AssessmentCard onClick={handleAssessmentClick}>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <Title level={3} style={{ color: 'white', marginBottom: '12px' }}>
                  Mental Health Assessment
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', marginBottom: '20px' }}>
                  Through professional psychological assessment scales, comprehensively understand your mental health status, including stress, anxiety, depression and other dimensions
                </Paragraph>
                <Button type="primary" size="large" ghost>
                  Start Assessment
                </Button>
              </div>
            </AssessmentCard>
          </Col>

          <Col xs={24} md={12}>
            <ChatCard onClick={handleChatClick}>
              <div style={{ textAlign: 'center' }}>
                <MessageOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <Title level={3} style={{ color: 'white', marginBottom: '12px' }}>
                  AI Mental Health Chat
                </Title>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', marginBottom: '20px' }}>
                  Chat with 3D virtual psychological counselor in real-time, get professional mental health advice and emotional support, available 24/7
                </Paragraph>
                <Button type="primary" size="large" ghost>
                  Start Chat
                </Button>
              </div>
            </ChatCard>
          </Col>
        </Row>

        <Divider style={{ margin: '40px 0' }} />

        {/* Assessment Categories Display */}
        <div>
          <Title level={3} style={{ marginBottom: '24px', textAlign: 'center' }}>
            Mental Health Assessment Categories
          </Title>
          <Row gutter={[16, 16]}>
            {assessmentCategories.map((category) => (
              <Col xs={24} sm={12} lg={8} key={category.id}>
                <CategoryCard
                  hoverable
                  onClick={() => handleCategoryClick(category.id)}
                  cover={
                    <div style={{
                      height: '120px',
                      background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {category.icon}
                    </div>
                  }
                >
                  <Card.Meta
                    title={category.title}
                    description={category.description}
                  />
                  <div style={{ marginTop: '12px' }}>
                    <Button type="link" style={{ padding: 0, color: category.color }}>
                      Start Test →
                    </Button>
                  </div>
                </CategoryCard>
              </Col>
            ))}
          </Row>
        </div>


      </div>
    </DashboardLayout>
  );
};

export default MentalHealthSupport;
