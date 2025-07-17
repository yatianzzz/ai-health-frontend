import React, { useState } from 'react';
import { Card, Typography, Progress, Tag, Space, Switch, message } from 'antd';
import { 
  ClockCircleOutlined, 
  FireOutlined, 
  HeartOutlined, 
  CheckOutlined, 
  RightOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

interface ExerciseItem {
  id: string;
  title: string;
  time: string;
  duration: number;
  calories: number;
  completed: boolean;
  type: 'cardio' | 'strength' | 'flexibility';
}

const ExerciseCompactList: React.FC = () => {
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
    <Card style={{ width: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
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

      {exercises.map(exercise => (
        <div key={exercise.id} style={{ marginBottom: exercise.id !== '3' ? 16 : 0, padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            {exercise.completed ? 
              <CheckOutlined style={{ color: '#52c41a', fontSize: 20, marginRight: 8 }} /> :
              <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 20, marginRight: 8 }} />
            }
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Text strong style={{ marginRight: 8 }}>{exercise.title}</Text>
                <Tag color={getTagColor(exercise.type)}>{exercise.type}</Tag>
              </div>
              <Text type="secondary">{exercise.time}</Text>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Switch
                checked={exercise.completed}
                onChange={(checked) => toggleExerciseCompletion(exercise.id, checked)}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren="Done?"
                size="small"
              />
            </div>
          </div>
          <Space size={4} style={{ marginLeft: 28 }}>
            <Tag icon={<ClockCircleOutlined />}>{exercise.duration} min</Tag>
            <Tag icon={<FireOutlined />}>{exercise.calories} kcal</Tag>
            {/* <Tag icon={<HeartOutlined />}>Medium Intensity</Tag> */}
          </Space>
        </div>
      ))}
    </Card>
  );
};

export default ExerciseCompactList; 