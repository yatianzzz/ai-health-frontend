import React, { useState } from 'react';
import { Card, Typography, Progress, Tag, Space } from 'antd';
import { ClockCircleOutlined, FireOutlined, HeartOutlined, CheckOutlined, RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface ExerciseItem {
  id: string;
  title: string;
  time: string;
  duration: number;
  calories: number;
  completed: boolean;
  type: 'cardio' | 'strength' | 'flexibility';
}

const SimplifiedExerciseCard: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    {
      id: '1',
      title: 'Morning Cardio',
      time: '07:00 AM',
      duration: 30,
      calories: 250,
      completed: true,
      type: 'cardio'
    },
    {
      id: '2',
      title: 'Strength Training',
      time: '01:00 PM',
      duration: 45,
      calories: 320,
      completed: false,
      type: 'strength'
    },
    {
      id: '3',
      title: 'Evening Stretching',
      time: '07:30 PM',
      duration: 15,
      calories: 80,
      completed: false,
      type: 'flexibility'
    }
  ]);

  const completedCount = exercises.filter(ex => ex.completed).length;
  
  const getTagColor = (type: string) => {
    switch (type) {
      case 'cardio': return 'red';
      case 'strength': return 'blue';
      case 'flexibility': return 'green';
      default: return 'default';
    }
  };

  return (
    <Card style={{ width: 400, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text>Daily Progress</Text>
          <Text strong>{completedCount}/3 completed</Text>
        </div>
        <Progress 
          percent={completedCount / 3 * 100} 
          showInfo={false} 
          strokeColor="#1890ff"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <CheckOutlined style={{ color: '#52c41a', fontSize: 20, marginRight: 8 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ marginRight: 8 }}>Morning Cardio</Text>
              <Tag color="red">cardio</Tag>
            </div>
            <Text type="secondary">07:00 AM</Text>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: '#52c41a' }}>Completed</Text>
          </div>
        </div>
        <Space size={4} style={{ marginLeft: 28 }}>
          <Tag icon={<ClockCircleOutlined />}>30 min</Tag>
          <Tag icon={<FireOutlined />}>250 kcal</Tag>
          <Tag icon={<HeartOutlined />}>Medium Intensity</Tag>
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20, marginRight: 8 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ marginRight: 8 }}>Strength Training</Text>
              <Tag color="blue">strength</Tag>
            </div>
            <Text type="secondary">01:00 PM</Text>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: '#1890ff' }}>Start</Text>
            <RightOutlined style={{ marginLeft: 4 }} />
          </div>
        </div>
        <Space size={4} style={{ marginLeft: 28 }}>
          <Tag icon={<ClockCircleOutlined />}>45 min</Tag>
          <Tag icon={<FireOutlined />}>320 kcal</Tag>
          <Tag icon={<HeartOutlined />}>Medium Intensity</Tag>
        </Space>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20, marginRight: 8 }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Text strong style={{ marginRight: 8 }}>Evening Stretching</Text>
              <Tag color="green">flexibility</Tag>
            </div>
            <Text type="secondary">07:30 PM</Text>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Text style={{ color: '#1890ff' }}>Start</Text>
            <RightOutlined style={{ marginLeft: 4 }} />
          </div>
        </div>
        <Space size={4} style={{ marginLeft: 28 }}>
          <Tag icon={<ClockCircleOutlined />}>15 min</Tag>
          <Tag icon={<FireOutlined />}>80 kcal</Tag>
          <Tag icon={<HeartOutlined />}>Medium Intensity</Tag>
        </Space>
      </div>
    </Card>
  );
};

export default SimplifiedExerciseCard; 