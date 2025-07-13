import React, { useEffect } from 'react';
import { Avatar, Card, Row, Col, Button, Statistic, Progress, Divider } from 'antd';
import { UserOutlined, AppleOutlined, FireOutlined, SmileOutlined, ClockCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useExercise } from '../context/ExerciseContext';
import UserProfileForm from '../components/UserProfileForm';
import HealthArticles from '../components/HealthArticles';
import ExerciseCompactList from '../components/ExerciseCompactList';
import { useMentalHealth } from '../context/MentalHealthContext';
import { useDiet } from '../context/DietContext';
import { getDailySummaryData, DailySummaryData } from '../services/dietAPI';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile, isProfileComplete } = useUser();
  const { 
    totalSteps, 
    totalCalories, 
    totalDuration, 
    stepsCompletion, 
    caloriesCompletion, 
    durationCompletion,
    refreshExerciseData
  } = useExercise();
  const { mentalHealthData } = useMentalHealth();
  const { dietaryRecords, foodItems } = useDiet();
  const [showProfileForm, setShowProfileForm] = React.useState(false);
  const [dailySummary, setDailySummary] = React.useState<DailySummaryData | null>(null);

  useEffect(() => {
    // Refresh exercise data when component mounts
    refreshExerciseData();
  }, [refreshExerciseData]);

  // Fetch dietary summary data
  useEffect(() => {
    const fetchDailySummary = async () => {
      try {
        const response = await getDailySummaryData();
        if (response.code === 200) {
          setDailySummary(response.data);
        }
      } catch (error) {
        console.error('Error fetching daily summary:', error);
      }
    };
    fetchDailySummary();
  }, [dietaryRecords, foodItems]);

  const goToExercisePage = () => {
    navigate('/dashboard/exercise');
  };

  const goToDietPage = () => {
    navigate('/dashboard/diet');
  };

  const handleProfileSubmit = async (profileData: any) => {
    try {
      await updateUserProfile(profileData);
      localStorage.setItem('profileComplete', 'true');
      setShowProfileForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  
  return (
    <div>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <Avatar size={80} style={{ marginRight: '20px', backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Good morning, {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
          </div>
          <div style={{ color: '#888' }}>
            {userProfile ? userProfile.occupation : 'User'} | Age: {userProfile ? userProfile.age : '--'} | 
            Favorite Sport: {userProfile ? userProfile.favoriteSport : 'Not specified'}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div>Total Consultations</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>56</div>
        </div>
        <div style={{ marginLeft: '60px', textAlign: 'right' }}>
          <div>Review Progress</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>8<span style={{ fontSize: '16px', color: '#888' }}>/24</span></div>
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        {/* Left Column - Health Summary */}
        <Col xs={24} lg={16}>
          <h2 style={{ marginBottom: '20px' }}>Health Management Core Modules</h2>
          
          {/* Personalized Dietary Suggestions Module */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#e6f7ff',
                  color: '#1890ff',
                  fontSize: 28,
                  marginRight: 16
                }}>
                  <AppleOutlined />
                </div>
                <span>Dietary Suggestions</span>
              </div>
            }
            style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            headStyle={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            <p>Powered by AI technology and external datasets, the system analyzes users' daily eating behaviors and health conditions to produce real-time, tailored nutritional designs and dietary instructions.</p>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="Daily Calorie Intake" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={dailySummary?.caloriesConsumed || 0}
                    suffix="kcal"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Calories Burned" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={dailySummary?.caloriesBurned || 0}
                    suffix="kcal"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Net Calories" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={Math.abs(dailySummary?.netCalories || 0)}
                    suffix="kcal"
                    valueStyle={{
                      color: (dailySummary?.netCalories || 0) >= 0 ? '#fa8c16' : '#52c41a'
                    }}
                    prefix={
                      (dailySummary?.netCalories || 0) >= 0 ?
                        <ArrowUpOutlined style={{ color: '#fa8c16' }} /> :
                        <ArrowDownOutlined style={{ color: '#52c41a' }} />
                    }
                  />
                </Card>
              </Col>
            </Row>
            <Button type="primary" style={{ marginTop: 16 }} onClick={goToDietPage}>
              Get Personalized Diet Plan
            </Button>
          </Card>
          
          {/* Customized Exercise Guidance Module */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff7e6',
                  color: '#fa8c16',
                  fontSize: 28,
                  marginRight: 16
                }}>
                  <FireOutlined />
                </div>
                <span>Customized Exercise Guidance</span>
              </div>
            }
            style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
            headStyle={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
          >
            <p>The system develops scientifically sound fitness plans based on users' exercise data and physical characteristics. It provides daily exercise amounts and summarizes weekly progress based on user feedback and data analysis for continuous improvement.</p>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card title="Total Steps" style={{ textAlign: 'center' }}>
                  <Statistic 
                    value={totalSteps} 
                    suffix="steps" 
                    valueStyle={{ color: '#1890ff', fontSize: '24px' }} 
                    prefix={<div style={{ color: '#1890ff', marginRight: '4px' }}>⟳</div>}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Progress percent={stepsCompletion} showInfo={false} strokeColor="#1890ff" />
                    <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'left', marginTop: '4px' }}>
                      {Math.round(stepsCompletion)}% of weekly goal
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Calories Burned" style={{ textAlign: 'center' }}>
                  <Statistic 
                    value={totalCalories} 
                    suffix="kcal" 
                    valueStyle={{ color: '#fa8c16', fontSize: '24px' }} 
                    prefix={<div style={{ color: '#fa8c16', marginRight: '4px' }}>⟳</div>}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Progress percent={caloriesCompletion} showInfo={false} strokeColor="#fa8c16" />
                    <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'left', marginTop: '4px' }}>
                      {Math.round(caloriesCompletion)}% of weekly goal
                    </div>
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Active Minutes" style={{ textAlign: 'center' }}>
                  <Statistic 
                    value={totalDuration} 
                    suffix="min" 
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }} 
                    prefix={<div style={{ color: '#52c41a', marginRight: '4px' }}>⟳</div>}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Progress percent={durationCompletion} showInfo={false} strokeColor="#52c41a" />
                    <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'left', marginTop: '4px' }}>
                      {Math.round(durationCompletion)}% of weekly goal
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Button type="primary" style={{ marginTop: 16 }} onClick={goToExercisePage}>
              View Exercise Plan
            </Button>
          </Card>
          
          {/* Health Articles Section */}
          <HealthArticles />
        </Col>
        
        {/* Right Column - Exercise Reminders and Mental Health */}
        <Col xs={24} lg={8}>
          {/* Exercise Reminders */}
          <ExerciseCompactList />
          
          {/* Mental Health Support Module */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f6ffed',
                  color: '#52c41a',
                  fontSize: 20,
                  marginRight: 12
                }}>
                  <SmileOutlined />
                </div>
                <span>Mental Health Support</span>
              </div>
            }
            style={{ marginBottom: 24 }}
          >
            <p>Through fine-tuned LLM and an immersive 3D interactive interface, the system provides immediate emotional support and mental health advice.</p>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card size="small" title="Comprehensive Evaluation" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={mentalHealthData.comprehensiveEvaluation}
                    valueStyle={{
                      color: mentalHealthData.comprehensiveEvaluation === 'Stable' ? '#52c41a' :
                             mentalHealthData.comprehensiveEvaluation === 'Unstable' ? '#f5222d' : '#666',
                      fontSize: '16px'
                    }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Stress Index" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={mentalHealthData.stressIndex}
                    suffix={mentalHealthData.stressIndex !== '--' ? '/100' : ''}
                    valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" title="Today's Mood" style={{ textAlign: 'center' }}>
                  <Statistic
                    value={mentalHealthData.todaysMood}
                    valueStyle={{
                      color: mentalHealthData.todaysMood === 'Very good' ? '#52c41a' :
                             mentalHealthData.todaysMood === 'Good' ? '#1890ff' :
                             mentalHealthData.todaysMood === 'Sad' ? '#fa8c16' :
                             mentalHealthData.todaysMood === 'Depressed' ? '#f5222d' : '#666',
                      fontSize: '16px'
                    }}
                  />
                </Card>
              </Col>
            </Row>
            <Button
              type="primary"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => navigate('/dashboard/mental-health')}
            >
              Start Mental Health Consultation
            </Button>
          </Card>
        </Col>
      </Row>

      <UserProfileForm 
        visible={showProfileForm}
        onClose={() => setShowProfileForm(false)}
        onSubmit={handleProfileSubmit}
      />
    </div>
  );
};

const HomeWithLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Home />
    </DashboardLayout>
  );
};

export default HomeWithLayout; 