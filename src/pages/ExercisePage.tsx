import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Space, message, Typography } from 'antd';
import { FireOutlined, PlusOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import ExerciseAIChatBox from '../components/ExerciseAIChatBox';
import ExerciseForm from '../components/ExerciseForm';
import WeeklyExerciseSummary from '../components/WeeklyExerciseSummary';
import ExerciseRecommendation from '../components/ExerciseRecommendation';
import WeeklyExerciseRecommendation from '../components/WeeklyExerciseRecommendation';
import { saveExerciseData } from '../services/exerciseAPI';
import { ExerciseData } from '../components/ExerciseForm';
import { useExercise } from '../context/ExerciseContext';

const { Title, Paragraph } = Typography;


const mockUserData = {
  bmi: 26.4, // Suboptimal health range
  gender: 'male' as 'male' | 'female'
};

const ExercisePage: React.FC = () => {
  const [showExerciseForm, setShowExerciseForm] = useState<boolean>(false);
  const [userData, setUserData] = useState(mockUserData);
  const { refreshExerciseData } = useExercise();

  const chatboxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // 延迟滚动以确保组件已完全渲染
    setTimeout(() => {
      chatboxRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center' 
      });
    }, 500);
  }, []); 

  useEffect(() => {
    // fetch the user's BMI and gender here
    
    // const fetchUserData = async () => {
    //   try {
    //     const response = await getUserProfile();
    //     if (response.code === 200) {
    //       const { height, weight, gender } = response.data;
    //       const bmi = weight / ((height/100) * (height/100));
    //       setUserData({ bmi, gender });
    //     }
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // };
    // fetchUserData();
    
  }, []);

  const handleExerciseSubmit = async (data: ExerciseData) => {
    try {
      // 调用保存API
      const response = await saveExerciseData(data);
      
      if (response.code === 200) {
        message.success('Exercise record saved successfully!');
        setShowExerciseForm(false);
        
        // 更新BMI
        const height = data.height;
        const weight = data.weight;
        const bmi = weight / ((height/100) * (height/100));
        setUserData(prev => ({ ...prev, bmi }));
        
        // 刷新运动数据
        await refreshExerciseData();
      } else if (response.code === 400) {
        // 数据验证错误
        message.error(response.message || 'Missing required fields');
      } else {
        // 其他错误
        message.error(response.message || 'Failed to save exercise record');
      }
    } catch (error) {
      console.error('Error saving exercise record:', error);
      message.error('Failed to save exercise record. Please try again.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Exercise Guidance</h2>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setShowExerciseForm(true)}
          size="large"
        >
          Record Exercise
        </Button>
      </div>
      
      {/* Weekly Exercise Summary */}
      <WeeklyExerciseSummary />
      
      {/* AI Weekly Exercise Recommendation */}
      <WeeklyExerciseRecommendation />
      
      {/* Exercise Overview */}
      <Card 
        // title={
        //   <div style={{ display: 'flex', alignItems: 'center' }}>
        //     <div style={{
        //       width: 56,
        //       height: 56,
        //       borderRadius: '50%',
        //       display: 'flex',
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: '#fff7e6',
        //       color: '#fa8c16',
        //       fontSize: 28,
        //       marginRight: 16
        //     }}>
        //       <FireOutlined />
        //     </div>
        //     {/* <span>Customized Exercise Guidance</span> */}
        //   </div>
        // }
        style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
        headStyle={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
      >
        {/* <Paragraph>
          The system develops scientifically sound fitness plans based on users' exercise data and physical characteristics. 
          It provides daily exercise amounts and summarizes weekly progress based on user feedback and data analysis for continuous improvement.
        </Paragraph> */}
        
        {/* BMI-based Exercise Recommendations */}
        {/* <ExerciseRecommendation bmi={userData.bmi} gender={userData.gender} /> */}
        
        <Space direction="vertical" size="large" style={{ width: '100%', marginTop: 0 }}>
          <Title level={4}>AI Exercise Assistant</Title>
          {/* AI Exercise ChatBox */}
          <div 
            // ref={chatboxRef} 
            style={{ minHeight: '500px' 
          }}>
            <ExerciseAIChatBox />
          </div>
        </Space>
      </Card>

      {/* Exercise Form Modal */}
      <ExerciseForm
        visible={showExerciseForm}
        onClose={() => setShowExerciseForm(false)}
        onSubmit={handleExerciseSubmit}
      />
    </div>
  );
};

const ExerciseWithLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <ExercisePage />
    </DashboardLayout>
  );
};

export default ExerciseWithLayout; 