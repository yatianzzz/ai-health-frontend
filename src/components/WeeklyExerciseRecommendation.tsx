import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Tabs, Row, Col, Alert, Spin, message, Divider } from 'antd';
import { RobotOutlined, ReloadOutlined, CalendarOutlined, FireOutlined, BugOutlined } from '@ant-design/icons';
import { generateWeeklyExerciseRecommendation, ExerciseRecommendation, UserComprehensiveData as AIUserData } from '../services/deepseekAPI';
import { getUserComprehensiveData, UserComprehensiveData } from '../services/userDataAPI';
import { useAuth } from '../context/AuthContext';

const { Title, Text, Paragraph } = Typography;

interface WeeklyExerciseRecommendationProps {
  style?: React.CSSProperties;
}

const WeeklyExerciseRecommendation: React.FC<WeeklyExerciseRecommendationProps> = ({ style }) => {
  const [recommendation, setRecommendation] = useState<ExerciseRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserComprehensiveData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [apiCallCount, setApiCallCount] = useState(0);
  const { isAuthenticated } = useAuth();

  const fetchUserData = async () => {
    // 只有在用户已认证时才获取数据
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping user data fetch');
      setUserData(null);
      setError('Please login to view recommendations');
      return;
    }

    try {
      console.log('🔄 Fetching user data...');
      const response = await getUserComprehensiveData();
      console.log('📊 User data response:', response);

      if (response.code === 200) {
        setUserData(response.data);
        console.log('✅ User data loaded successfully:', response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  const generateRecommendation = async () => {
    if (!userData) {
      message.error('User data not available. Please try again.');
      return;
    }

    setLoading(true);
    setError(null);
    const currentCallCount = apiCallCount + 1;
    setApiCallCount(currentCallCount);
    
    try {
      console.log(`🚀 [Call #${currentCallCount}] Starting recommendation generation...`);
      
      // Transform user data for AI processing
      const transformedData: AIUserData = {
        profile: {
          firstName: userData.profile?.firstName || 'User',
          lastName: userData.profile?.lastName || 'Test',
          age: userData.profile?.age || 25,
          gender: userData.profile?.gender || 'male',
          occupation: userData.profile?.occupation || 'office worker',
          favoriteSport: userData.profile?.favoriteSport || 'running',
          height: userData.activities.length > 0 ? userData.activities[0].height : 170,
          weight: userData.activities.length > 0 ? userData.activities[0].weight : 70,
          bmi: userData.activities.length > 0 ? userData.activities[0].bmi : 24.2,
        },
        activities: userData.activities || [],
        dietaryRecords: userData.dietaryRecords || [],
        recentStats: {
          totalSteps: userData.stats?.totalSteps || 5000,
          totalCalories: userData.stats?.totalCalories || 200,
          totalDuration: userData.stats?.totalDuration || 120,
          avgHeartRate: userData.stats?.avgHeartRate || 75,
        }
      };

      console.log(`📋 [Call #${currentCallCount}] Transformed data for AI:`, transformedData);

      const result = await generateWeeklyExerciseRecommendation(transformedData);
      console.log(`✅ [Call #${currentCallCount}] Recommendation generated:`, result);
      
      setRecommendation(result);
      message.success(`AI recommendation #${currentCallCount} generated successfully!`);
    } catch (error) {
      console.error(`❌ [Call #${currentCallCount}] Error generating recommendation:`, error);
      setError(`Failed to generate recommendation (Call #${currentCallCount}). Please try again.`);
      message.error(`Failed to generate recommendation (Call #${currentCallCount}). Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Test function to verify API connectivity
  const testApiConnection = async () => {
    console.log('🧪 Testing Deepseek API connection...');
    setLoading(true);
    
    try {
      const testData: AIUserData = {
        profile: {
          firstName: 'Test',
          lastName: 'User',
          age: 30,
          gender: 'male',
          occupation: 'developer',
          favoriteSport: 'basketball',
          height: 175,
          weight: 75,
          bmi: 24.5,
        },
        activities: [
          {
            exerciseType: 'running',
            duration: 30,
            calories: 300,
            steps: 5000
          }
        ],
        dietaryRecords: [],
        recentStats: {
          totalSteps: 10000,
          totalCalories: 500,
          totalDuration: 150,
          avgHeartRate: 80,
        }
      };

      const result = await generateWeeklyExerciseRecommendation(testData);
      console.log('🎯 Test API call result:', result);
      
      if (result) {
        message.success('✅ Deepseek API connection test successful!');
        setRecommendation(result);
      }
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      message.error('❌ API connection test failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  const renderTrainingSection = (title: string, data: any, icon: React.ReactNode) => (
    <Card
      title={
        <Space>
          {icon}
          <span>{title}</span>
        </Space>
      }
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <Text strong>{key}:</Text>
            <Paragraph style={{ marginLeft: 16, marginBottom: 8 }}>
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </Paragraph>
          </div>
        ))}
      </Space>
    </Card>
  );

  const renderWeeklySchedule = (schedule: any) => (
    <Row gutter={[16, 16]}>
      {Object.entries(schedule).map(([day, plan]) => (
        <Col xs={24} sm={12} md={8} key={day}>
          <Card
            title={day}
            size="small"
            style={{ height: '100%' }}
          >
            <Text>{typeof plan === 'string' ? plan : JSON.stringify(plan)}</Text>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const renderDebugInfo = () => (
    <Card
      title="🔍 Debug Information"
      size="small"
      style={{ marginBottom: 16 }}
      extra={
        <Button
          size="small"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
        >
          {showDebugInfo ? 'Hide' : 'Show'} Debug
        </Button>
      }
    >
      {showDebugInfo && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>API Calls Made:</Text> {apiCallCount}
          </div>
          <div>
            <Text strong>User Data Available:</Text> {userData ? '✅ Yes' : '❌ No'}
          </div>
          {userData && (
            <div>
              <Text strong>Profile:</Text> {userData.profile ? '✅' : '❌'} | 
              <Text strong> Activities:</Text> {userData.activities?.length || 0} | 
              <Text strong> Diet Records:</Text> {userData.dietaryRecords?.length || 0}
            </div>
          )}
          <div>
            <Text strong>Recommendation Status:</Text> {recommendation ? '✅ Generated' : '⏳ Not yet generated'}
          </div>
          <Divider />
          <Text type="secondary">
            Check browser console (F12) for detailed logs with emoji indicators:
            🔍 = Start, 📤 = API Request, 📥 = API Response, ✅ = Success, ❌ = Error
          </Text>
        </Space>
      )}
    </Card>
  );

  const tabItems = [
    {
      key: '1',
      label: 'Strength Training',
      children: recommendation ? renderTrainingSection(
        'Strength Training',
        recommendation['Strength Training'],
        <FireOutlined />
      ) : null,
    },
    {
      key: '2',
      label: 'Cardio Training',
      children: recommendation ? renderTrainingSection(
        'Cardio Training',
        recommendation['Cardio Training'],
        <FireOutlined />
      ) : null,
    },
    {
      key: '3',
      label: 'Flexibility Training',
      children: recommendation ? renderTrainingSection(
        'Flexibility Training',
        recommendation['Flexibility Training'],
        <FireOutlined />
      ) : null,
    },
    {
      key: '4',
      label: 'Weekly Schedule',
      children: recommendation ? (
        <div>
          <Title level={5}>
            <CalendarOutlined /> Weekly Schedule
          </Title>
          {renderWeeklySchedule(recommendation['Weekly Schedule'])}
        </div>
      ) : null,
    },
  ];

  return (
    <Card
      title={
        <Space>
          <RobotOutlined />
          <span>AI Weekly Exercise Recommendation</span>
        </Space>
      }
      extra={
        <Space>
          <Button
            icon={<BugOutlined />}
            onClick={testApiConnection}
            loading={loading}
          >
            Test API
          </Button>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            loading={loading}
            onClick={generateRecommendation}
            disabled={!userData}
          >
            Generate Recommendation
          </Button>
        </Space>
      }
      style={{ marginBottom: 24, ...style }}
    >
      {/* Debug Info */}
      {renderDebugInfo()}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {!userData && !error && (
        <Alert
          message="Loading user data..."
          description="Please wait while we fetch your profile and activity data."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {userData && !recommendation && !loading && (
        <Alert
          message="Ready to generate recommendation"
          description={`Click 'Generate Recommendation' for personalized advice or 'Test API' to verify Deepseek connection. Calls made: ${apiCallCount}`}
          type="success"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>AI is analyzing your data and generating personalized recommendations...</Text>
            <br />
            <Text type="secondary">Call #{apiCallCount} in progress...</Text>
          </div>
        </div>
      )}

      {recommendation && (
        <div>
          <Alert
            message={`Recommendation Generated Successfully! (Call #${apiCallCount})`}
            description="Based on your profile, recent activities, and fitness goals, here's your personalized weekly exercise recommendation:"
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Tabs items={tabItems} defaultActiveKey="1" />
        </div>
      )}
    </Card>
  );
};

export default WeeklyExerciseRecommendation; 