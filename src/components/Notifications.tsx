import React, { useState } from 'react';
import { Badge, Popover, List, Typography, Button, Avatar, Divider } from 'antd';
import { BellOutlined, FireOutlined, BookOutlined, CheckOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'exercise' | 'article' | 'tip';
  icon: React.ReactNode;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Time for your daily exercise!',
      description: 'You haven\'t completed your 30-minute workout today.',
      time: '2 hours ago',
      read: false,
      type: 'exercise',
      icon: <FireOutlined style={{ color: '#ff4d4f' }} />
    },
    {
      id: '2',
      title: 'New article: "Benefits of Morning Walks"',
      description: 'Check out our latest health article on morning exercises.',
      time: '5 hours ago',
      read: false,
      type: 'article',
      icon: <BookOutlined style={{ color: '#1890ff' }} />
    },
    {
      id: '3',
      title: 'Hydration reminder',
      description: 'Remember to drink at least 8 glasses of water today!',
      time: 'Yesterday',
      read: true,
      type: 'tip',
      icon: <FireOutlined style={{ color: '#52c41a' }} />
    },
    {
      id: '4',
      title: 'Weekly health summary available',
      description: 'Your weekly health report is ready to view.',
      time: '2 days ago',
      read: true,
      type: 'tip',
      icon: <BookOutlined style={{ color: '#722ed1' }} />
    },
    {
      id: '5',
      title: 'Exercise goal achieved!',
      description: 'Congratulations! You\'ve reached your weekly step goal.',
      time: '3 days ago',
      read: true,
      type: 'exercise',
      icon: <CheckOutlined style={{ color: '#52c41a' }} />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Title level={5} style={{ margin: 0 }}>Notifications</Title>
        <Button type="link" size="small" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      <Divider style={{ margin: '8px 0' }} />
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <List.Item 
            style={{ 
              backgroundColor: item.read ? 'transparent' : 'rgba(24, 144, 255, 0.05)',
              padding: '8px 12px',
              cursor: 'pointer'
            }}
            onClick={() => markAsRead(item.id)}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={item.icon} 
                  style={{ backgroundColor: item.read ? '#f0f0f0' : '#e6f7ff' }}
                />
              }
              title={<Text strong={!item.read}>{item.title}</Text>}
              description={
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                  <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '4px' }}>{item.time}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Button type="link">View All</Button>
      </div>
    </div>
  );

  return (
    <Popover 
      content={notificationContent} 
      trigger="click" 
      placement="bottomRight"
      overlayStyle={{ width: 320 }}
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default Notifications; 