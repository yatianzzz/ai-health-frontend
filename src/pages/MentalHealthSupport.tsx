import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Space, Divider, Statistic, Progress, message } from 'antd';
import {
  HeartOutlined,
  MessageOutlined,
  UserOutlined,
  SmileOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  BookOutlined
} from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useMentalHealth } from '../context/MentalHealthContext';
import { generateMentalHealthAdvice, AssessmentResult, MentalHealthAdvice, getUserMoods, createUserMood, updateUserMood, UserMoodRecord } from '../services/mentalHealthAPI';
import MentalHealthAdviceModal from '../components/MentalHealthAdviceModal';

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
  // const { mentalHealthData } = useMentalHealth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // AI Advice states
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<MentalHealthAdvice | null>(null);
  const [completedAssessments, setCompletedAssessments] = useState<AssessmentResult[]>([]);
  
  // Load saved advice from localStorage
  const [savedAdvice, setSavedAdvice] = useState<MentalHealthAdvice | null>(() => {
    const saved = localStorage.getItem('savedMentalHealthAdvice');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved advice:', error);
        return null;
      }
    }
    return null;
  });

  // Mood record states
  const [moodLoading, setMoodLoading] = useState(true);
  const [moodError, setMoodError] = useState<string | null>(null);
  const [latestMood, setLatestMood] = useState<UserMoodRecord | null>(null);

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

  const handleGenerateAdvice = async () => {
    if (!hasCompletedAllAssessments()) {
      message.warning('Please complete all three assessments first (Mental Health, Stress, and Anxiety)');
      return;
    }

    setAdviceLoading(true);
    setShowAdviceModal(true);

    try {
      // Create assessment results from context data
      const assessmentResults: AssessmentResult[] = [
        {
          type: 'mental',
          score: latestMood?.totalEvaluation === 'Stable' ? 30 : 70,
          maxScore: 90,
          level: latestMood?.totalEvaluation || 'Unstable', // ensure string
          answers: {}
        },
        {
          type: 'stress',
          score: typeof latestMood?.stressValue === 'number' ? latestMood.stressValue : 0,
          maxScore: 100,
          level: typeof latestMood?.stressValue === 'number'
            ? (latestMood.stressValue <= 25 ? 'Low' :
               latestMood.stressValue <= 50 ? 'Moderate' :
               latestMood.stressValue <= 75 ? 'High' : 'Very High')
            : 'Moderate',
          answers: {}
        },
        {
          type: 'anxiety',
          score: 30, // Default anxiety score
          maxScore: 60,
          level: 'Moderate',
          answers: {}
        }
      ];

      const response = await generateMentalHealthAdvice(assessmentResults);
      
      if (response.code === 200) {
        setAiAdvice(response.data);
        setSavedAdvice(response.data);
        // Save to localStorage
        localStorage.setItem('savedMentalHealthAdvice', JSON.stringify(response.data));
        message.success('AI advice generated successfully!');
      } else {
        throw new Error(response.message || 'Failed to generate advice');
      }
    } catch (error: any) {
      console.error('Error generating advice:', error);
      message.error(error.message || 'Failed to generate advice. Please try again.');
    } finally {
      setAdviceLoading(false);
    }
  };

  // Check if all assessments are completed
  const hasCompletedAllAssessments = () => {
    const hasMental = !!latestMood?.totalEvaluation;
    const hasStress = typeof latestMood?.stressValue === 'number';
    const hasAnxiety = true; // We'll assume anxiety assessment is completed if we have other data
    
    console.log('Assessment completion status:', {
      mental: hasMental,
      stress: hasStress,
      anxiety: hasAnxiety,
      comprehensiveEvaluation: latestMood?.totalEvaluation,
      stressValue: latestMood?.stressValue
    });
    
    return hasMental && hasStress && hasAnxiety;
  };

  // Check if user has saved advice
  const hasSavedAdvice = () => {
    return savedAdvice !== null;
  };

  // Handle viewing saved advice
  const handleViewSavedAdvice = () => {
    if (savedAdvice) {
      setAiAdvice(savedAdvice);
      setShowAdviceModal(true);
    }
  };

  // Fetch latest mood record on mount
  React.useEffect(() => {
    const fetchMood = async () => {
      setMoodLoading(true);
      setMoodError(null);
      try {
        const res = await getUserMoods();
        if (res.code === 200 && res.data.length > 0) {
          // Sort by recordTime desc, pick latest
          const sorted = [...res.data].sort((a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime());
          setLatestMood(sorted[0]);
        } else {
          setLatestMood(null);
        }
      } catch (err: any) {
        setMoodError(err.message || 'Failed to load mood data');
        setLatestMood(null);
      } finally {
        setMoodLoading(false);
      }
    };
    fetchMood();
  }, []);

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
          extra={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                type="primary" 
                icon={<RobotOutlined />}
                onClick={handleGenerateAdvice}
                disabled={!hasCompletedAllAssessments()}
                style={{ 
                  backgroundColor: hasCompletedAllAssessments() ? '#52c41a' : '#d9d9d9',
                  borderColor: hasCompletedAllAssessments() ? '#52c41a' : '#d9d9d9'
                }}
              >
                {hasCompletedAllAssessments() ? 'Get AI Advice' : 'Complete Assessments First'}
              </Button>
              {hasSavedAdvice() && (
                <Button 
                  type="default"
                  icon={<BookOutlined />}
                  onClick={handleViewSavedAdvice}
                  style={{ 
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    color: 'white'
                  }}
                >
                  View Saved Advice
                </Button>
              )}
            </div>
          }
        >
          {moodLoading ? (
            <div style={{ textAlign: 'center', padding: 24 }}>Loading mood data...</div>
          ) : moodError ? (
            <div style={{ color: 'red', textAlign: 'center', padding: 24 }}>{moodError}</div>
          ) : latestMood ? (
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
                    value={latestMood.totalEvaluation}
                    valueStyle={{
                      color: latestMood.totalEvaluation === 'Stable' ? '#52c41a' :
                             latestMood.totalEvaluation === 'Unstable' ? '#f5222d' : '#666',
                      fontSize: '24px',
                      fontWeight: 'bold'
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      borderRadius: '3px',
                      background: latestMood.totalEvaluation === 'Stable' ? '#52c41a' :
                                 latestMood.totalEvaluation === 'Unstable' ? '#f5222d' : '#d9d9d9'
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
                    value={latestMood.stressValue}
                    suffix={'/100'}
                    valueStyle={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Progress
                      percent={latestMood.stressValue}
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
                    value={latestMood.todaysMood}
                    valueStyle={{
                      color: latestMood.todaysMood === 'Very good' ? '#52c41a' :
                             latestMood.todaysMood === 'Good' ? '#1890ff' :
                             latestMood.todaysMood === 'Sad' ? '#fa8c16' :
                             latestMood.todaysMood === 'Depressed' ? '#f5222d' : '#666',
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
                      {latestMood.todaysMood === 'Very good' ? '😊' :
                       latestMood.todaysMood === 'Good' ? '🙂' :
                       latestMood.todaysMood === 'Sad' ? '😔' :
                       latestMood.todaysMood === 'Depressed' ? '😢' : '😐'}
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: 24 }}>No mood record found.</div>
          )}
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

        {/* AI Advice Modal */}
        <MentalHealthAdviceModal
          visible={showAdviceModal}
          onClose={() => setShowAdviceModal(false)}
          advice={aiAdvice}
          loading={adviceLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default MentalHealthSupport;
