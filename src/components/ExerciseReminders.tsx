import React, { useState } from 'react';
import { Card, Typography, List, Tag, Progress, Button, Switch, message } from 'antd';
import { 
  ClockCircleOutlined, 
  FireOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  HeartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface ExerciseReminder {
  id: string;
  title: string;
  time: string;
  duration: number;
  calories: number;
  completed: boolean;
  type: 'cardio' | 'strength' | 'flexibility';
}

const ExerciseReminders: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseReminder[]>([
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

  const completedExercises = exercises.filter(ex => ex.completed).length;
  const completionPercentage = (completedExercises / exercises.length) * 100;

  const getTagColor = (type: string) => {
    switch (type) {
      case 'cardio': return 'red';
      case 'strength': return 'blue';
      case 'flexibility': return 'green';
      default: return 'default';
    }
  };

  const toggleExerciseCompletion = (id: string, completed: boolean) => {
    setExercises(exercises.map(exercise => 
      exercise.id === id ? { ...exercise, completed } : exercise
    ));
    
    message.success(completed ? 
      'Exercise marked as completed!' : 
      'Exercise marked as not completed'
    );
  };

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>Today's Exercise Plan</Title>
          <Text type="secondary">
            <ClockCircleOutlined /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Text>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text>Daily Progress</Text>
          <Text strong>{completedExercises}/{exercises.length} completed</Text>
        </div>
        <Progress 
          percent={completionPercentage} 
          status={completionPercentage === 100 ? "success" : "active"}
          showInfo={false}
        />
      </div>
      
      <List
        itemLayout="horizontal"
        dataSource={exercises}
        renderItem={item => (
          <List.Item
            actions={[
              <Switch
                checked={item.completed}
                onChange={(checked) => toggleExerciseCompletion(item.id, checked)}
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren={<CloseCircleOutlined />}
              />
            ]}
            style={{ 
              padding: '12px 0',
              opacity: item.completed ? 0.7 : 1
            }}
          >
            <List.Item.Meta
              avatar={
                item.completed ? 
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} /> : 
                <ClockCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Text strong style={{ marginRight: 8 }}>{item.title}</Text>
                  <Tag color={getTagColor(item.type)}>{item.type}</Tag>
                </div>
              }
              description={
                <div>
                  <Text type="secondary">{item.time}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag icon={<ClockCircleOutlined />}>{item.duration} min</Tag>
                    <Tag icon={<FireOutlined />}>{item.calories} kcal</Tag>
                    <Tag icon={<HeartOutlined />}>Medium Intensity</Tag>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="primary">View Weekly Plan</Button>
      </div>
    </Card>
  );
};

export default ExerciseReminders; 