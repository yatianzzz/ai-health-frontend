import React, { useEffect, useState, useCallback } from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Typography, Empty } from 'antd';
import { FireOutlined, ClockCircleOutlined, HeartOutlined } from '@ant-design/icons';
import { getWeeklySummary, UserActivity } from '../services/exerciseAPI';
import { Column } from '@ant-design/plots';
import { useExercise } from '../context/ExerciseContext';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const WeeklyExerciseSummary: React.FC = () => {
  const [weeklyRecords, setWeeklyRecords] = useState<UserActivity[]>([]);
  const [recordsByDay, setRecordsByDay] = useState<{[key: string]: UserActivity[]}>({});
  const [recordCount, setRecordCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  const {
    totalSteps,
    totalCalories,
    totalDuration,
    stepsCompletion,
    caloriesCompletion,
    durationCompletion,
    isLoading,
    refreshExerciseData
  } = useExercise();

  const fetchDetailedSummary = useCallback(async () => {
    // 只有在用户已认证时才获取数据
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping detailed summary fetch');
      setWeeklyRecords([]);
      setRecordsByDay({});
      setRecordCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getWeeklySummary();
      if (response.code === 200 && response.data) {
        setWeeklyRecords(response.data.weeklyRecords || []);
        setRecordsByDay(response.data.recordsByDay || {});
        setRecordCount(response.data.recordCount || 0);
      } else {
        // Handle case when data is null
        setWeeklyRecords([]);
        setRecordsByDay({});
        setRecordCount(0);
      }
    } catch (error) {
      console.error('Error fetching weekly summary details:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // 在组件挂载和数据更新时刷新
  useEffect(() => {
    fetchDetailedSummary();
  }, [fetchDetailedSummary, totalSteps, totalCalories, totalDuration]);

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    // 获取英文缩写并转换为固定格式
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    // 映射到标准的三字母缩写格式: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const dayMap: {[key: string]: string} = {
      'Sun': 'Sun',
      'Mon': 'Mon',
      'Tue': 'Tue',
      'Wed': 'Wed',
      'Thu': 'Thu',
      'Fri': 'Fri',
      'Sat': 'Sat'
    };
    return dayMap[day] || day;
  };

  // Prepare data for step chart
  const getStepsChartData = () => {
    if (!weeklyRecords.length) return [];
    
    // Get today's day number (0 = Sunday, 1 = Monday, etc.)
    const today = new Date().getDay();
    
    // Create ordered days array starting from 6 days ago to today
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      // Calculate the day number, considering week wraparound
      const dayNum = (today - 6 + i + 7) % 7;
      // Convert day number to day name
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return dayNames[dayNum];
    });
    
    // Initialize with zero steps for all days
    const stepsByDate: {[key: string]: number} = {};
    daysOfWeek.forEach(day => {
      stepsByDate[day] = 0;
    });
    
    // Group by date and sum steps
    weeklyRecords.forEach(record => {
      const day = getDayName(record.activityDate);
      if (daysOfWeek.includes(day)) {
        stepsByDate[day] += record.steps || 0;
      }
    });

    // Convert to chart format, maintaining chronological order
    return daysOfWeek.map(day => ({
      day,
      steps: stepsByDate[day]
    }));
  };

  // Updated to use Column chart instead of Line
  const stepsChartConfig = {
    data: getStepsChartData(),
    height: 200,
    xField: 'day',
    yField: 'steps',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    color: '#1890ff',
    label: {
      position: 'top',
      style: {
        fill: '#aaa',
        opacity: 0.6,
      },
    },
    // 确保所有天都显示在X轴上
    xAxis: {
      type: 'cat',
      tickCount: 7,
    },
    // 为空值设置样式
    interactions: [{ type: 'element-highlight' }],
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'blue',
        },
      },
    }
  };

  if (loading || isLoading) {
    return (
      <Card loading={true} style={{ borderRadius: 8, marginBottom: 24 }}>
        <div style={{ height: 300 }}></div>
      </Card>
    );
  }

  if (recordCount === 0) {
    return (
      <Card
        title={<Title level={5}>Weekly Exercise Summary</Title>}
        style={{ borderRadius: 8, marginBottom: 24 }}
      >
        <Empty 
          description="No exercise records found for this week" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card 
      title={<Title level={5}>Weekly Exercise Summary</Title>}
      style={{ borderRadius: 8, marginBottom: 24 }}
    >
      <Row gutter={[16, 24]}>
        <Col span={8}>
          <Statistic 
            title="Total Steps" 
            value={totalSteps} 
            suffix="steps"
            valueStyle={{ color: '#1890ff' }}
            prefix={<FireOutlined />}
          />
          <Progress 
            percent={stepsCompletion} 
            showInfo={false} 
            strokeColor="#1890ff" 
            status="active"
          />
          <Text type="secondary">{stepsCompletion.toFixed(0)}% of weekly goal</Text>
        </Col>
        <Col span={8}>
          <Statistic 
            title="Calories Burned" 
            value={totalCalories} 
            suffix="kcal"
            valueStyle={{ color: '#fa8c16' }}
            prefix={<FireOutlined />}
          />
          <Progress 
            percent={caloriesCompletion} 
            showInfo={false} 
            strokeColor="#fa8c16" 
            status="active"
          />
          <Text type="secondary">{caloriesCompletion.toFixed(0)}% of weekly goal</Text>
        </Col>
        <Col span={8}>
          <Statistic 
            title="Active Minutes" 
            value={totalDuration} 
            suffix="min"
            valueStyle={{ color: '#52c41a' }}
            prefix={<ClockCircleOutlined />}
          />
          <Progress 
            percent={durationCompletion} 
            showInfo={false} 
            strokeColor="#52c41a" 
            status="active"
          />
          <Text type="secondary">{durationCompletion.toFixed(0)}% of weekly goal</Text>
        </Col>
      </Row>
      
      <div style={{ marginTop: 24 }}>
        <Title level={5}>Weekly Steps Trend</Title>
        <Column {...stepsChartConfig} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Title level={5}>Recent Activities ({recordCount})</Title>
        <List
          dataSource={weeklyRecords.slice(0, 5)}
          renderItem={item => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong>{item.exerciseType}</Text>
                    <Tag color="blue" style={{ marginLeft: 8 }}>
                      {getDayName(item.activityDate)}
                    </Tag>
                  </div>
                  <div>
                    <Tag color="volcano">{item.calories} kcal</Tag>
                    <Tag color="green">{item.duration} min</Tag>
                    <Tag color="blue">{item.steps} steps</Tag>
                    {item.maxHeartRate && (
                      <Tag color="red">
                        <HeartOutlined /> {item.maxHeartRate} bpm
                      </Tag>
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </Card>
  );
};

export default WeeklyExerciseSummary; 