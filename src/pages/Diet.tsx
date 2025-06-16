import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Tabs, Card, Spin } from 'antd';
import DashboardLayout from '../layouts/DashboardLayout';
import DietaryForm from '../components/DietaryForm';
import DietaryDataDisplay from '../components/DietaryDataDisplay';
import { useDiet } from '../context/DietContext';

const { TabPane } = Tabs;

const Diet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('1');
  const { 
    addDietaryRecord, 
    fetchDietaryRecords, 
    fetchCalorieData, 
    isLoading 
  } = useDiet();
  

  const fetchData = useCallback(() => {
    fetchDietaryRecords();
    fetchCalorieData('week');
  }, [fetchDietaryRecords, fetchCalorieData]);
  
 
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleDietaryFormSubmit = async (values: any) => {
    try {
      await addDietaryRecord(values);
     
      setActiveTab('2');
    } catch (error) {
      console.error('Error submitting dietary record:', error);
    }
  };
  
 
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  
  return (
    <div>
      <h1>Dietary Suggestions</h1>
      <p style={{ marginBottom: 24 }}>
        Track your food intake, view nutrition data, and get personalized dietary recommendations based on your health profile and goals.
      </p>
      
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Add Dietary Record" key="1">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <DietaryForm onSubmit={handleDietaryFormSubmit} loading={isLoading} />
            </Col>
            <Col xs={24} lg={8}>
              <Card title="Dietary Tips" style={{ height: '100%' }}>
                <h4>Healthy Eating Guidelines</h4>
                <ul>
                  <li>Aim for at least 5 servings of fruits and vegetables daily</li>
                  <li>Choose whole grains over refined grains</li>
                  <li>Include lean protein sources in your meals</li>
                  <li>Stay hydrated by drinking plenty of water</li>
                  <li>Limit added sugars and processed foods</li>
                </ul>
                
                <h4>Portion Control Tips</h4>
                <ul>
                  <li>Use smaller plates to help control portions</li>
                  <li>Fill half your plate with vegetables</li>
                  <li>Measure serving sizes with kitchen tools</li>
                  <li>Be mindful of calorie-dense foods</li>
                </ul>
                
                <h4>Meal Planning Benefits</h4>
                <ul>
                  <li>Saves time and reduces stress</li>
                  <li>Helps maintain a balanced diet</li>
                  <li>Reduces food waste</li>
                  <li>Makes it easier to track nutrition</li>
                </ul>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="View Dietary Data" key="2">
          {/* 使用key属性确保组件不会因为父组件重新渲染而重复创建 */}
          <div key="dietary-data">
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <DietaryDataDisplay />
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

const DietWithLayout: React.FC = React.memo(() => {
  return (
    <DashboardLayout>
      <Diet />
    </DashboardLayout>
  );
});

export default DietWithLayout; 