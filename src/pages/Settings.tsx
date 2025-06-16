import React from 'react';
import { Card, Form, Input, Button, Switch, Divider, Select, Radio } from 'antd';
import DashboardLayout from '../layouts/DashboardLayout';

const { Option } = Select;

const Settings: React.FC = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '20px' }}>Settings</h2>
      
      <Card style={{ marginBottom: '20px' }}>
        <h3>User Settings</h3>
        <Divider />
        <Form layout="vertical" initialValues={{ notifications: true, language: 'english', theme: 'light' }}>
          <Form.Item label="Name" name="name">
            <Input placeholder="John Smith" />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="john.smith@example.com" />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input placeholder="+1 555-1234" />
          </Form.Item>
          <Form.Item label="Notifications" name="notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Language" name="language">
            <Select>
              <Option value="english">English</Option>
              <Option value="chinese">Chinese</Option>
              <Option value="spanish">Spanish</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Theme" name="theme">
            <Radio.Group>
              <Radio value="light">Light</Radio>
              <Radio value="dark">Dark</Radio>
              <Radio value="system">System</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary">Save Changes</Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card style={{ marginBottom: '20px' }}>
        <h3>System Settings</h3>
        <Divider />
        <Form layout="vertical" initialValues={{ dataSync: true, dataRetention: '90', privacy: 'high' }}>
          <Form.Item label="Data Synchronization" name="dataSync" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Data Retention Period (days)" name="dataRetention">
            <Select>
              <Option value="30">30 days</Option>
              <Option value="60">60 days</Option>
              <Option value="90">90 days</Option>
              <Option value="180">180 days</Option>
              <Option value="365">365 days</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Privacy Level" name="privacy">
            <Radio.Group>
              <Radio value="low">Low</Radio>
              <Radio value="medium">Medium</Radio>
              <Radio value="high">High</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary">Apply Settings</Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card>
        <h3>About System</h3>
        <Divider />
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Last Updated:</strong> April 7, 2023</p>
        <p><strong>System Information:</strong> AI-powered Interactive Health Management System</p>
        <p>
          This project helps users to manage their health at all three levels with Diet, Exercise, and Mental health in an integrated manner. 
          The system includes Personalized Dietary Suggestions, Customized Exercise Guidance, and Mental Health Support powered by AI technology.
        </p>
        <Button type="default" style={{ marginTop: '16px' }}>Check for Updates</Button>
      </Card>
    </div>
  );
};

const SettingsWithLayout: React.FC = () => {
  return (
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  );
};

export default SettingsWithLayout; 