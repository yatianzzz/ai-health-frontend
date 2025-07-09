import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Card, Input, Button, Typography, Space, Avatar, Spin, Row, Col } from 'antd';
import { SendOutlined, ArrowLeftOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import DashboardLayout from '../layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Panda3D from '../components/Panda3D';


const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 200px);
  gap: 24px;
`;

const ThreeDContainer = styled.div`
  width: 450px;
  height: 500px;
  background: linear-gradient(135deg, #FFF9C4 0%, #F4D03F 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='450' height='500' viewBox='0 0 450 500' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3C!-- 小鸡主体 --%3E%3Cellipse cx='225' cy='350' rx='80' ry='70' fill='%23FFF3A0' stroke='%23D4A574' stroke-width='3'/%3E%3C!-- 小鸡头部 --%3E%3Ccircle cx='225' cy='280' r='50' fill='%23FFF3A0' stroke='%23D4A574' stroke-width='3'/%3E%3C!-- 眼睛 --%3E%3Ccircle cx='210' cy='270' r='4' fill='%23333'/%3E%3Ccircle cx='240' cy='270' r='4' fill='%23333'/%3E%3C!-- 腮红 --%3E%3Cellipse cx='195' cy='285' rx='8' ry='6' fill='%23FFB6C1' opacity='0.6'/%3E%3Cellipse cx='255' cy='285' rx='8' ry='6' fill='%23FFB6C1' opacity='0.6'/%3E%3C!-- 嘴巴 --%3E%3Cpath d='M220 290 L225 295 L230 290' stroke='%23FF8C00' stroke-width='2' fill='%23FF8C00'/%3E%3C!-- 翅膀 --%3E%3Cellipse cx='170' cy='340' rx='25' ry='35' fill='%23F4D03F' stroke='%23D4A574' stroke-width='2' transform='rotate(-20 170 340)'/%3E%3Cellipse cx='280' cy='340' rx='25' ry='35' fill='%23F4D03F' stroke='%23D4A574' stroke-width='2' transform='rotate(20 280 340)'/%3E%3C!-- 装饰星星 --%3E%3Cpath d='M100 150 L105 160 L115 160 L107 167 L110 177 L100 170 L90 177 L93 167 L85 160 L95 160 Z' fill='%23FFD700'/%3E%3Cpath d='M350 120 L353 127 L360 127 L355 131 L357 138 L350 134 L343 138 L345 131 L340 127 L347 127 Z' fill='%23FFD700'/%3E%3Cpath d='M80 400 L82 405 L87 405 L84 408 L85 413 L80 410 L75 413 L76 408 L73 405 L78 405 Z' fill='%23FFD700'/%3E%3Cpath d='M370 380 L373 387 L380 387 L375 391 L377 398 L370 394 L363 398 L365 391 L360 387 L367 387 Z' fill='%23FFD700'/%3E%3C!-- 光芒线条 --%3E%3Cpath d='M225 200 L225 190' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M260 220 L268 212' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M280 255 L290 255' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M260 290 L268 298' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M190 220 L182 212' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M170 255 L160 255' stroke='%23D4A574' stroke-width='2'/%3E%3Cpath d='M190 290 L182 298' stroke='%23D4A574' stroke-width='2'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.15;
    pointer-events: none;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: 20px;
    right: 30px;
    font-size: 24px;
    animation: sparkle 2s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

const ChatPanel = styled.div`
  width: 400px;
  height: 500px;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
  max-height: 400px;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  display: flex;
  margin-bottom: 16px;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

const MessageContent = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  background: ${props => props.$isUser ? '#1890ff' : 'white'};
  color: ${props => props.$isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`;



interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// 3D Panda Assistant Component
const VirtualAssistant: React.FC<{
  isListening: boolean;
  isSpeaking: boolean;
  onInteract?: () => void;
}> = ({ isListening, isSpeaking, onInteract }) => {
  const handleClick = () => {
    if (onInteract) {
      onInteract();
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        cursor: 'pointer',
      }}
    >
      <Suspense fallback={<Spin size="large" />}>
        <Panda3D
          width={400}
          height={450}
        />
      </Suspense>
    </div>
  );




};



// 2D场景组件
const TwoDScene: React.FC<{
  isListening: boolean;
  isSpeaking: boolean;
  onAssistantInteract?: () => void;
}> = ({ isListening, isSpeaking, onAssistantInteract }) => {
  return (
    <div style={{
      height: '100%',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 虚拟助手 */}
      <VirtualAssistant
        isListening={isListening}
        isSpeaking={isSpeaking}
        onInteract={onAssistantInteract}
      />
    </div>
  );
};

const MentalHealthChat: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hello! I\'m here to listen to your thoughts and provide support and guidance. How are you feeling today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI responses
  const getAIResponse = (userMessage: string): string => {
    const responses = [
      'I understand how you\'re feeling. Can you tell me more details about this situation?',
      'That sounds really challenging. How have you handled similar situations before?',
      'Your feelings are completely understandable. Let\'s explore some coping strategies together.',
      'Thank you for sharing this with me. When do you feel this emotion most strongly?',
      'I hear your concerns. Do you have any support systems you can rely on?',
      'That\'s a great observation. What do you think might help improve this situation?'
    ];

    // Provide more specific responses based on keywords
    if (userMessage.toLowerCase().includes('stress') || userMessage.toLowerCase().includes('pressure') || userMessage.toLowerCase().includes('overwhelmed')) {
      return 'Stress is a very common experience in life. Let\'s try some deep breathing exercises or discuss some stress-relief methods. What are some ways you usually relax?';
    }
    if (userMessage.toLowerCase().includes('anxiety') || userMessage.toLowerCase().includes('anxious') || userMessage.toLowerCase().includes('worry')) {
      return 'Anxiety can be really uncomfortable. Remember, most things we worry about don\'t actually happen. Let\'s focus on the present moment - what are some things you can control right now?';
    }
    if (userMessage.toLowerCase().includes('sad') || userMessage.toLowerCase().includes('depressed') || userMessage.toLowerCase().includes('down')) {
      return 'I can sense your sadness. It\'s important to allow yourself to feel these emotions. Would you like to tell me what\'s making you feel sad?';
    }
    if (userMessage.toLowerCase().includes('happy') || userMessage.toLowerCase().includes('good') || userMessage.toLowerCase().includes('great')) {
      return 'I\'m so glad to hear you\'re feeling positive! What\'s been contributing to these good feelings? It\'s wonderful to celebrate these moments.';
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsListening(true);

    // 触发全局消息发送事件来隐藏说话框
    window.dispatchEvent(new CustomEvent('messageSent'));

    // 模拟AI思考时间
    setTimeout(() => {
      setIsListening(false);
      setIsSpeaking(true);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);

      // 模拟说话时间
      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000 + Math.random() * 1000);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAssistantInteract = () => {
    if (!isLoading && !isSpeaking) {
      const greetings = [
        "Hello! I'm your AI mental health assistant. I'm delighted to help you!",
        "Welcome to our mental health conversation space. I'm here to listen to your thoughts.",
        "Hi there! How are you feeling today? We can talk about anything that's on your mind.",
        "Nice to meet you! I'm an AI assistant specially designed for mental health support.",
        "*waves wing* Hello friend! I'm here whenever you need someone to talk to."
      ];

      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];

      const greetingMessage: Message = {
        id: Date.now(),
        text: randomGreeting,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, greetingMessage]);
      setIsSpeaking(true);

      setTimeout(() => {
        setIsSpeaking(false);
      }, 2000);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/dashboard/mental-health')}
            style={{ marginBottom: '16px' }}
          >
            Back
          </Button>
          <Title level={2}>AI Mental Health Chat</Title>
          <Paragraph style={{ color: '#666' }}>
            Have a private, secure conversation with your dedicated AI mental health assistant
          </Paragraph>
        </div>

        <ChatContainer>
          {/* 3D虚拟人物区域 */}
          <ThreeDContainer>
            <TwoDScene
              isListening={isListening || isLoading}
              isSpeaking={isSpeaking}
              onAssistantInteract={handleAssistantInteract}
            />

            {/* Status Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '12px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <Text style={{ color: 'white', fontSize: '13px', fontWeight: '500' }}>
                {isLoading ? '🤔 Thinking...' :
                 isListening ? '👂 Listening...' :
                 isSpeaking ? '💬 Speaking...' :
                 '😊 Waiting for your message'}
              </Text>
            </div>


          </ThreeDContainer>

          {/* Chat Panel */}
          <ChatPanel>
            <Card title="Chat" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <MessagesContainer>
                {messages.map((message) => (
                  <MessageBubble key={message.id} $isUser={message.isUser}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {!message.isUser && (
                        <Avatar
                          src="/chick.jpg"
                          style={{
                            backgroundColor: '#FFD700',
                            border: '2px solid #F4D03F',
                            borderRadius: '50%'
                          }}
                        />
                      )}
                      <MessageContent $isUser={message.isUser}>
                        <Text style={{ color: message.isUser ? 'white' : '#333' }}>
                          {message.text}
                        </Text>
                        <div style={{ 
                          fontSize: '11px', 
                          opacity: 0.7, 
                          marginTop: '4px',
                          color: message.isUser ? 'rgba(255, 255, 255, 0.7)' : '#999'
                        }}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </MessageContent>
                      {message.isUser && (
                        <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
                      )}
                    </div>
                  </MessageBubble>
                ))}
                {isLoading && (
                  <MessageBubble $isUser={false}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Avatar
                        src="/chick.jpg"
                        style={{
                          backgroundColor: '#FFD700',
                          border: '2px solid #F4D03F',
                          borderRadius: '50%'
                        }}
                      />
                      <MessageContent $isUser={false}>
                        <Spin size="small" />
                        <Text style={{ marginLeft: '8px', color: '#666' }}>Thinking...</Text>
                      </MessageContent>
                    </div>
                  </MessageBubble>
                )}
                <div ref={messagesEndRef} />
              </MessagesContainer>

              <InputContainer>
                <TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share your thoughts and feelings..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  style={{ flex: 1 }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  style={{ alignSelf: 'flex-end' }}
                >
                  Send
                </Button>
              </InputContainer>
            </Card>
          </ChatPanel>
        </ChatContainer>


      </div>
    </DashboardLayout>
  );
};

export default MentalHealthChat;
