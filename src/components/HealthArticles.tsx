import React from 'react';
import { Card, Row, Col, Typography, Tag, Button, Avatar } from 'antd';
import { CalendarOutlined, EyeOutlined, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category: string;
  views: number;
  likes: number;
  author: {
    name: string;
    avatar: string;
  };
}

const articles: Article[] = [
  {
    id: '1',
    title: 'The Benefits of Regular Exercise for Mental Health',
    summary: 'Discover how just 30 minutes of daily physical activity can significantly improve your mental wellbeing and reduce anxiety.',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    date: 'May 15, 2023',
    category: 'Mental Health',
    views: 1245,
    likes: 328,
    author: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    id: '2',
    title: 'Nutrition Essentials: Building a Balanced Diet',
    summary: 'Learn the fundamentals of nutrition and how to create meal plans that provide all the nutrients your body needs.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    date: 'May 10, 2023',
    category: 'Nutrition',
    views: 987,
    likes: 245,
    author: {
      name: 'Michael Chen, RD',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: '3',
    title: 'Sleep Quality: The Forgotten Pillar of Health',
    summary: 'Explore the science behind sleep and practical strategies to improve your sleep quality for better overall health.',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    date: 'May 5, 2023',
    category: 'Sleep',
    views: 756,
    likes: 189,
    author: {
      name: 'Dr. James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  }
];

const HealthArticles: React.FC = () => {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Health Articles & News</Title>
        <Button type="link">View All</Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {articles.map(article => (
          <Col xs={24} sm={24} md={8} key={article.id}>
            <Card
              hoverable
              cover={
                <div style={{ height: 200, overflow: 'hidden' }}>
                  <img 
                    alt={article.title} 
                    src={article.image}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              }
              bodyStyle={{ padding: 16 }}
            >
              <Tag color="blue">{article.category}</Tag>
              <Title level={5} style={{ marginTop: 12, marginBottom: 8, height: 48, overflow: 'hidden' }}>
                {article.title}
              </Title>
              <Paragraph ellipsis={{ rows: 2 }} style={{ color: '#8c8c8c', fontSize: 14, height: 40 }}>
                {article.summary}
              </Paragraph>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={article.author.avatar} size="small" />
                  <Text style={{ marginLeft: 8, fontSize: 12 }}>{article.author.name}</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CalendarOutlined style={{ marginRight: 4 }} />
                  {article.date}
                </Text>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, color: '#8c8c8c', fontSize: 12 }}>
                <span>
                  <EyeOutlined style={{ marginRight: 4 }} />
                  {article.views} views
                </span>
                <span>
                  <HeartOutlined style={{ marginRight: 4 }} />
                  {article.likes} likes
                </span>
                <span>
                  <ShareAltOutlined style={{ marginRight: 4 }} />
                  Share
                </span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HealthArticles; 