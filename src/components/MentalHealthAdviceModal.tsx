import React, { useState } from 'react';
import { Modal, Card, Typography, List, Button, Spin, message } from 'antd';
import { 
  HeartOutlined, 
  CheckCircleOutlined, 
  PlayCircleOutlined, 
  BulbOutlined, 
  BookOutlined 
} from '@ant-design/icons';
import { MentalHealthAdvice } from '../services/mentalHealthAPI';

const { Title, Paragraph, Text } = Typography;

interface MentalHealthAdviceModalProps {
  visible: boolean;
  onClose: () => void;
  advice: MentalHealthAdvice | null;
  loading: boolean;
}

const MentalHealthAdviceModal: React.FC<MentalHealthAdviceModalProps> = ({
  visible,
  onClose,
  advice,
  loading
}) => {
  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HeartOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          <span>AI Mental Health Advice</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={800}
      centered
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>
            <Text>Generating personalized mental health advice...</Text>
          </div>
        </div>
      ) : advice ? (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {/* Summary */}
          <Card style={{ marginBottom: '16px', backgroundColor: '#f6ffed' }}>
            <Title level={4} style={{ color: '#52c41a', marginBottom: '8px' }}>
              <CheckCircleOutlined style={{ marginRight: '8px' }} />
              Summary
            </Title>
            <Paragraph style={{ fontSize: '16px', margin: 0 }}>
              {advice.summary}
            </Paragraph>
          </Card>

          {/* Recommendations */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                <CheckCircleOutlined style={{ marginRight: '8px' }} />
                Key Recommendations
              </Title>
            }
            style={{ marginBottom: '16px' }}
          >
            <List
              dataSource={advice.recommendations}
              renderItem={(item, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#1890ff',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      {index + 1}
                    </div>
                    <Text style={{ fontSize: '15px' }}>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Activities */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                <PlayCircleOutlined style={{ marginRight: '8px' }} />
                Recommended Activities
              </Title>
            }
            style={{ marginBottom: '16px' }}
          >
            <List
              dataSource={advice.activities}
              renderItem={(item, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#52c41a',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      {index + 1}
                    </div>
                    <Text style={{ fontSize: '15px' }}>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* Tips */}
          <Card 
            title={
              <Title level={4} style={{ margin: 0, color: '#fa8c16' }}>
                <BulbOutlined style={{ marginRight: '8px' }} />
                Practical Tips
              </Title>
            }
            style={{ marginBottom: '16px' }}
          >
            <List
              dataSource={advice.tips}
              renderItem={(item, index) => (
                <List.Item>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#fa8c16',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      marginRight: '12px',
                      marginTop: '2px'
                    }}>
                      {index + 1}
                    </div>
                    <Text style={{ fontSize: '15px' }}>{item}</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>


        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text type="secondary">No advice available</Text>
        </div>
      )}
    </Modal>
  );
};

export default MentalHealthAdviceModal; 