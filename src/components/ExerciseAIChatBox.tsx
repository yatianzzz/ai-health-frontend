import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, Avatar, Divider } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ExerciseAIChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your Exercise Guidance AI assistant. How can I help you with fitness and workout today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sample quick questions
  const quickQuestions = [
        "What exercises are suitable for beginners?",
        "How do I start a workout routine?",
    "How many times should I exercise per week?",
        "How to create a personalized workout plan?",
        "How to recover after a workout?",
    "What diet best complements exercise?"
  ];

  useEffect(() => {
    // 只在消息容器内部滚动
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "For beginners, I recommend starting with bodyweight exercises like squats, push-ups, and lunges. These help build foundational strength without equipment.",
        "A balanced workout routine should include 150 minutes of moderate activity per week, with a mix of cardio, strength training, and flexibility exercises.",
        "It's important to listen to your body. Make sure to warm up before exercise and cool down afterward to prevent injury.",
        "Based on your BMI and fitness goals, I would recommend focusing on a mix of cardio and strength training 3-4 times per week.",
        "Your recent activity shows good progress! Consider adding one more day of strength training to your weekly routine."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <Card 
      style={{ 
        width: '100%',
        borderRadius: 8,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Title level={4} style={{ textAlign: 'center', margin: 0, color: '#0dbbb5' }}>
        Intelligent Exercise Consultation
      </Title>
      
      <div 
        ref={chatContainerRef}
        style={{ 
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          height: '350px',
          marginBottom: '16px',
          marginTop: '16px',
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}
      >
            {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.isUser ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            {!message.isUser && (
              <Avatar
                icon={<RobotOutlined />}
                style={{ 
                  backgroundColor: '#0dbbb5',
                  marginRight: '8px'
                }}
              />
            )}
            
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: message.isUser ? '12px 12px 0 12px' : '12px 12px 12px 0',
                backgroundColor: message.isUser ? '#0dbbb5' : 'white',
                color: message.isUser ? 'white' : 'rgba(0, 0, 0, 0.85)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                wordWrap: 'break-word'
              }}
            >
              <Text style={{ color: message.isUser ? 'white' : 'inherit' }}>
                {message.content}
              </Text>
                  </div>
            
            {message.isUser && (
              <Avatar
                icon={<UserOutlined />}
                style={{ 
                  backgroundColor: '#1890ff',
                  marginLeft: '8px'
                }}
              />
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
      
      <div>
        <div style={{ display: 'flex', marginBottom: '16px' }}>
          <Input
              placeholder="Type your question here..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            style={{ 
              borderRadius: '20px 0 0 20px',
              padding: '8px 16px'
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{ 
              borderRadius: '0 20px 20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Send
          </Button>
        </div>

        <Divider plain style={{ margin: '12px 0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>Beginner's Guide</Text>
        </Divider>
        
        <div style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              size="small"
              type="default"
              style={{ borderRadius: '16px', fontSize: '12px' }}
              onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
            </Button>
                ))}
              </div>
      </div>
    </Card>
  );
};

export default ExerciseAIChatBox; 