import React from 'react';
import { Card, Row, Col, Statistic, Progress, List, Tag, Typography, Divider } from 'antd';
import { FireOutlined, AppleOutlined, LineChartOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface MealData {
  id: string;
  mealType: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: string[];
}

const DietarySummary: React.FC = () => {
  // Sample data
  const todaysMeals: MealData[] = [
    {
      id: '1',
      mealType: 'Breakfast',
      time: '07:30 AM',
      calories: 450,
      protein: 20,
      carbs: 55,
      fat: 15,
      foods: ['Oatmeal with berries', 'Greek yogurt', 'Coffee']
    },
    {
      id: '2',
      mealType: 'Lunch',
      time: '12:30 PM',
      calories: 650,
      protein: 35,
      carbs: 65,
      fat: 22,
      foods: ['Grilled chicken salad', 'Whole grain bread', 'Apple']
    },
    {
      id: '3',
      mealType: 'Snack',
      time: '04:00 PM',
      calories: 200,
      protein: 5,
      carbs: 25,
      fat: 8,
      foods: ['Mixed nuts', 'Banana']
    },
    {
      id: '4',
      mealType: 'Dinner',
      time: '07:00 PM',
      calories: 750,
      protein: 40,
      carbs: 70,
      fat: 25,
      foods: ['Salmon fillet', 'Brown rice', 'Steamed vegetables', 'Olive oil']
    }
  ];

  const dailyGoals = {
    calories: 2100,
    protein: 105,
    carbs: 230,
    fat: 70
  };

  const totalConsumed = {
    calories: todaysMeals.reduce((sum, meal) => sum + meal.calories, 0),
    protein: todaysMeals.reduce((sum, meal) => sum + meal.protein, 0),
    carbs: todaysMeals.reduce((sum, meal) => sum + meal.carbs, 0),
    fat: todaysMeals.reduce((sum, meal) => sum + meal.fat, 0)
  };

  const percentages = {
    calories: Math.round((totalConsumed.calories / dailyGoals.calories) * 100),
    protein: Math.round((totalConsumed.protein / dailyGoals.protein) * 100),
    carbs: Math.round((totalConsumed.carbs / dailyGoals.carbs) * 100),
    fat: Math.round((totalConsumed.fat / dailyGoals.fat) * 100)
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'orange';
      case 'lunch': return 'green';
      case 'dinner': return 'blue';
      case 'snack': return 'purple';
      default: return 'default';
    }
  };

  return (
    <Card title="Today's Dietary Summary" style={{ marginBottom: 24 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Calories"
              value={totalConsumed.calories}
              suffix={`/ ${dailyGoals.calories} kcal`}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FireOutlined />}
            />
            <Progress 
              percent={percentages.calories} 
              status={percentages.calories > 100 ? "exception" : "active"}
              showInfo={false}
              strokeColor="#1890ff"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Protein"
              value={totalConsumed.protein}
              suffix={`/ ${dailyGoals.protein} g`}
              valueStyle={{ color: '#52c41a' }}
              prefix={<AppleOutlined />}
            />
            <Progress 
              percent={percentages.protein} 
              status={percentages.protein > 100 ? "exception" : "active"}
              showInfo={false}
              strokeColor="#52c41a"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Carbs"
              value={totalConsumed.carbs}
              suffix={`/ ${dailyGoals.carbs} g`}
              valueStyle={{ color: '#faad14' }}
              prefix={<AppleOutlined />}
            />
            <Progress 
              percent={percentages.carbs} 
              status={percentages.carbs > 100 ? "exception" : "active"}
              showInfo={false}
              strokeColor="#faad14"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="Fat"
              value={totalConsumed.fat}
              suffix={`/ ${dailyGoals.fat} g`}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<AppleOutlined />}
            />
            <Progress 
              percent={percentages.fat} 
              status={percentages.fat > 100 ? "exception" : "active"}
              showInfo={false}
              strokeColor="#ff4d4f"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0 16px' }} />
      
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Today's Meals</Title>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={todaysMeals}
        renderItem={meal => (
          <List.Item>
            <List.Item.Meta
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color={getMealTypeColor(meal.mealType)}>{meal.mealType}</Tag>
                    <Text style={{ marginLeft: 8 }}>{meal.time}</Text>
                  </div>
                  <Text strong>{meal.calories} kcal</Text>
                </div>
              }
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>
                    {meal.foods.map((food, index) => (
                      <Tag key={index} style={{ marginBottom: 4 }}>
                        {food}
                      </Tag>
                    ))}
                  </div>
                  <Row>
                    <Col span={8}>
                      <Text type="secondary">Protein: {meal.protein}g</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Carbs: {meal.carbs}g</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Fat: {meal.fat}g</Text>
                    </Col>
                  </Row>
                </div>
              }
            />
          </List.Item>
        )}
      />

      <div style={{ marginTop: 24, padding: 16, background: '#f9f9f9', borderRadius: 4 }}>
        <Row gutter={16} align="middle">
          <Col span={16}>
            <Text>Based on your dietary intake today, you're on track with your nutritional goals. Consider adding more protein to your evening meal to meet your daily target.</Text>
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Tag icon={<CheckCircleOutlined />} color="success">
              On Track
            </Tag>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default DietarySummary; 
 