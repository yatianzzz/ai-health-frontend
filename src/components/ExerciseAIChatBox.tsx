import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Card, Typography, Avatar, Divider, message, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, LoadingOutlined } from '@ant-design/icons';
import { getExerciseChatResponse } from '../services/deepseekAPI';

const { Text, Title } = Typography;

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// 简单的文本格式化函数
const formatTextContent = (content: string, isUser: boolean): JSX.Element => {
  const baseColor = isUser ? 'white' : 'inherit';
  
  // 处理markdown格式
  let formattedContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold; color: ' + (isUser ? 'white' : '#1890ff') + ';">$1</strong>') // 粗体
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: ' + (isUser ? 'white' : '#666') + ';">$1</em>') // 斜体
    .replace(/`(.*?)`/g, '<code style="background-color: ' + (isUser ? 'rgba(255,255,255,0.2)' : '#f5f5f5') + '; padding: 2px 4px; border-radius: 3px; color: ' + (isUser ? 'white' : '#d73a49') + '; font-size: 13px; font-family: monospace;">$1</code>') // 内联代码
    .replace(/```([\s\S]*?)```/g, '<pre style="background-color: ' + (isUser ? 'rgba(255,255,255,0.1)' : '#f5f5f5') + '; padding: 12px; border-radius: 6px; margin: 8px 0; overflow-x: auto; font-family: monospace; font-size: 13px; color: ' + (isUser ? 'white' : '#333') + ';"><code>$1</code></pre>') // 代码块
    .replace(/### (.*?)$/gm, '<h3 style="font-size: 16px; font-weight: bold; margin: 12px 0 8px 0; color: ' + (isUser ? 'white' : '#1890ff') + ';">$1</h3>') // 三级标题
    .replace(/## (.*?)$/gm, '<h2 style="font-size: 18px; font-weight: bold; margin: 12px 0 8px 0; color: ' + (isUser ? 'white' : '#1890ff') + ';">$1</h2>') // 二级标题
    .replace(/# (.*?)$/gm, '<h1 style="font-size: 20px; font-weight: bold; margin: 12px 0 8px 0; color: ' + (isUser ? 'white' : '#1890ff') + ';">$1</h1>') // 一级标题
    .replace(/^\- (.*?)$/gm, '<li style="margin: 4px 0; color: ' + baseColor + '; line-height: 1.6;">$1</li>') // 列表项
    .replace(/^\d+\. (.*?)$/gm, '<li style="margin: 4px 0; color: ' + baseColor + '; line-height: 1.6;">$1</li>') // 数字列表项
    .replace(/\n\n/g, '</p><p style="margin: 8px 0; color: ' + baseColor + '; line-height: 1.6; font-size: 14px;">') // 段落分隔
    .replace(/\n/g, '<br />'); // 单行换行

  // 包装列表项
  formattedContent = formattedContent.replace(/(<li[^>]*>.*?<\/li>)/g, '<ul style="margin: 8px 0; padding-left: 20px;">$1</ul>');
  
  // 添加段落包装
  if (!formattedContent.includes('<p')) {
    formattedContent = '<p style="margin: 8px 0; color: ' + baseColor + '; line-height: 1.6; font-size: 14px;">' + formattedContent + '</p>';
  }

  return (
    <div 
      style={{ 
        color: baseColor, 
        lineHeight: '1.6', 
        fontSize: '14px' 
      }}
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

// 消息内容渲染组件
const MessageContent: React.FC<{ content: string; isUser: boolean }> = ({ content, isUser }) => {
  return formatTextContent(content, isUser);
};

const ExerciseAIChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your Exercise Guidance AI assistant. How can I help you with fitness and workout today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // 构建对话历史
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      // 调用DeepSeek API
      console.log('🏃‍♂️ Calling DeepSeek API for exercise consultation...');
      const response = await getExerciseChatResponse(currentInput, conversationHistory);

      if (response && response.message) {
        const aiMessage: Message = {
          content: response.message,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        console.log('✅ Exercise AI response received successfully');
      } else {
        throw new Error('Invalid response from AI service');
      }
    } catch (error) {
      console.error('❌ Error calling exercise AI API:', error);
      
      // 显示错误消息给用户
      message.error('AI服务暂时不可用，请稍后再试');

      // 使用备用响应
      const fallbackResponses = [
        "For beginners, I recommend starting with bodyweight exercises like squats, push-ups, and lunges. These help build foundational strength without equipment.",
        "A balanced workout routine should include 150 minutes of moderate activity per week, with a mix of cardio, strength training, and flexibility exercises.",
        "It's important to listen to your body. Make sure to warm up before exercise and cool down afterward to prevent injury.",
        "Based on general fitness guidelines, I'd recommend focusing on a mix of cardio and strength training 3-4 times per week.",
        "Great question! Would you like me to help you create a personalized workout plan based on your fitness level and goals?"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      const fallbackMessage: Message = {
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
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
              <MessageContent content={message.content} isUser={message.isUser} />
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
            
            {/* 加载指示器 */}
            {isLoading && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ 
                    backgroundColor: '#0dbbb5',
                    marginRight: '8px'
                  }}
                />
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px 12px 12px 0',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Spin size="small" />
                  <Text style={{ color: '#666' }}>AI is thinking...</Text>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
      
      <div>
        <div style={{ display: 'flex', marginBottom: '16px', alignItems: 'stretch' }}>
          <Input
            placeholder={isLoading ? "AI is thinking..." : "Type your question here..."}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{ 
              borderRadius: '20px 0 0 20px',
              padding: '8px 16px',
              height: '40px',
              flex: 1
            }}
          />
          <Button
            type="primary"
            icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
            onClick={handleSend}
            loading={isLoading}
            disabled={isLoading || !inputValue.trim()}
            style={{ 
              borderRadius: '0 20px 20px 0',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px'
            }}
          >
            {isLoading ? 'Thinking...' : 'Send'}
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
              disabled={isLoading}
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