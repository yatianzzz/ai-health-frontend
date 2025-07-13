import React from 'react';
import { Card, Row, Col, Typography, Tag, Divider, List } from 'antd';

const { Title, Text, Paragraph } = Typography;

interface ExerciseRecommendationProps {
  bmi: number;
  gender: 'male' | 'female';
}

const ExerciseRecommendation: React.FC<ExerciseRecommendationProps> = ({ bmi, gender }) => {
  // Determine health status based on BMI
  let healthStatus: 'healthy' | 'suboptimal' | 'unhealthy' = 'healthy';
  let statusColor = '';
  
  if (bmi < 18.5 || (bmi >= 25 && bmi < 30)) {
    healthStatus = 'suboptimal';
    statusColor = '#fa8c16'; // Orange for suboptimal
  } else if (bmi >= 18.5 && bmi < 25) {
    healthStatus = 'healthy';
    statusColor = '#52c41a'; // Green for healthy
  } else {
    healthStatus = 'unhealthy';
    statusColor = '#f5222d'; // Red for unhealthy
  }

  // Get recommendations based on health status
  const getWorkoutRecommendations = () => {
    switch (healthStatus) {
      case 'suboptimal':
        return {
          title: "Strength Training Focus",
          description: "Focus on building muscle mass to improve metabolic health and body composition.",
          recommendations: [
            {
              type: "Strength Training",
              frequency: "3 times per week",
              duration: "45 minutes per session",
              exercises: [
                "Chest: Bench Press - 3 sets × 10 reps (10-15kg dumbbells)",
                "Back: Pull-ups - 3 sets × 8 reps (assisted if necessary)",
                "Legs: Barbell Squats - 3 sets × 12 reps (50% of body weight)"
              ]
            },
            {
              type: "Cardio",
              frequency: "Once per week",
              duration: "15 minutes per session",
              exercises: [
                "Slow jogging (pace ≤ 6km/h) or Swimming (200m × 3 sets)",
                "Intensity: Heart rate ≤ 60% of maximum heart rate"
              ]
            }
          ],
          tips: "Avoid: Long cardio sessions (>20 minutes) and isolated single-joint exercises (like bicep curls). Prioritize compound movements for better muscle growth efficiency."
        };
      case 'healthy':
        return {
          title: "Balanced Training Program",
          description: "Maintain overall fitness with a balanced approach to prevent metabolic decline.",
          recommendations: [
            {
              type: "Cardio Training",
              frequency: "3 times per week",
              duration: "35 minutes per session",
              exercises: [
                "Running: 6-7km/h pace, with 1-minute sprint every 10 minutes (heart rate up to 75%)",
                "Or Jump rope: 3 sets × 100 jumps, rest 1 minute between sets"
              ]
            },
            {
              type: "Flexibility Training",
              frequency: "Twice per week",
              duration: "12 minutes per session",
              exercises: [
                "Chest/Back: Doorway stretch - 3 sets × 30 seconds",
                "Legs: Quadriceps stretch + Hamstring stretch - 2 sets × 40 seconds each"
              ]
            }
          ],
          tips: "Focus on maintaining flexibility and cardiovascular health while preserving muscle mass."
        };
      case 'unhealthy':
        return {
          title: "Low-Impact Fat Burning Program",
          description: "Prioritize joint protection while gradually improving cardiovascular health and strength.",
          recommendations: [
            {
              type: "Low-Impact Cardio",
              frequency: "5 times per week",
              duration: "45 minutes (can be split into 2 sessions)",
              exercises: [
                "Primary: Swimming (breaststroke for 40 minutes) or Elliptical machine (resistance 8-10)",
                "Alternative: Water walking (waist-deep) 30 minutes + Recumbent bike 20 minutes"
              ]
            },
            {
              type: "Bodyweight Strength Training",
              frequency: "Twice per week",
              duration: "18 minutes per session",
              exercises: [
                "Lower body: Wall squats (knees not beyond toes) - 3 sets × 45 seconds",
                "Core: Supine leg raises (bent knees) - 3 sets × 12 reps",
                "Upper body: Kneeling push-ups - 3 sets × 10 reps"
              ]
            },
            {
              type: "Warm-up/Cool-down Routine",
              frequency: "Before and after each workout",
              duration: "10 minutes each",
              exercises: [
                "Warm-up: Side lunges + High knees - 2 sets × 30 seconds each",
                "Stretching: Foam rolling on front thighs + calves - 3 sets × 20 seconds each"
              ]
            }
          ],
          tips: "Take it slow and focus on proper form. Listen to your body and rest when needed."
        };
      default:
        return {
          title: "General Fitness Recommendation",
          description: "A balanced approach to fitness.",
          recommendations: [],
          tips: "Please consult with a fitness professional for personalized advice."
        };
    }
  };

  // Get calorie recommendations based on health status and gender
  const getCalorieRecommendations = () => {
    if (healthStatus === 'healthy') {
      return gender === 'female' ? '1800-2200' : '2200-2600';
    } else if (healthStatus === 'suboptimal') {
      return gender === 'female' ? '2100-2800' : '2900-3500';
    } else {
      return gender === 'female' ? '2200-3000' : '3000-3500';
    }
  };

  const workoutPlan = getWorkoutRecommendations();
  const calorieRange = getCalorieRecommendations();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Weekly Exercise Recommendation</span>
                <Tag color={statusColor} style={{ marginLeft: 12 }}>
                  {healthStatus === 'healthy' ? 'Healthy' : 
                   healthStatus === 'suboptimal' ? 'Suboptimal Health' : 'Needs Improvement'}
                </Tag>
              </div>
            }
            style={{ height: '100%' }}
          >
            <Title level={4}>{workoutPlan.title}</Title>
            <Paragraph>{workoutPlan.description}</Paragraph>
            
            {workoutPlan.recommendations.map((rec, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <Title level={5} style={{ color: statusColor }}>
                  {rec.type} <Text type="secondary" style={{ fontSize: 14 }}>
                    ({rec.frequency}, {rec.duration})
                  </Text>
                </Title>
                <List
                  size="small"
                  bordered
                  dataSource={rec.exercises}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                  style={{ backgroundColor: '#fafafa' }}
                />
              </div>
            ))}
            
            <Divider dashed />
            <div style={{ backgroundColor: '#f6ffed', padding: 12, borderRadius: 4, border: '1px solid #b7eb8f' }}>
              <Text strong>Key Notes: </Text>
              <Text>{workoutPlan.tips}</Text>
            </div>
          </Card>
        </Col>
        
        <Col span={8}>
          <Card title="Weekly Calorie Target" style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Title level={2} style={{ color: statusColor }}>
                {calorieRange} kcal
              </Title>
              <Text>Daily recommended intake</Text>
              <Divider />
              <Paragraph>
                <Text>BMI: {bmi.toFixed(1)}</Text><br />
                <Text>Gender: {gender === 'male' ? 'Male' : 'Female'}</Text>
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExerciseRecommendation; 