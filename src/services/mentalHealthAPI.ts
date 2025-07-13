import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-1555560e750b4bcb806c65171aa78f7e';

export interface AssessmentResult {
  type: 'mental' | 'stress' | 'anxiety';
  score: number;
  maxScore: number;
  level: string;
  answers: { [key: number]: number };
}

export interface MentalHealthAdvice {
  summary: string;
  recommendations: string[];
  activities: string[];
  tips: string[];
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const generateMentalHealthAdvice = async (
  assessmentResults: AssessmentResult[]
): Promise<ApiResponse<MentalHealthAdvice>> => {
  console.log('🧠 Starting mental health advice generation...');
  
  // Build detailed assessment result descriptions
  const assessmentDetails = assessmentResults.map(result => {
    const percentage = Math.round((result.score / result.maxScore) * 100);
    let severity = '';
    
    if (result.type === 'mental') {
      severity = percentage <= 50 ? 'Stable' : 'Unstable';
    } else if (result.type === 'stress') {
      if (percentage <= 25) severity = 'Low';
      else if (percentage <= 50) severity = 'Moderate';
      else if (percentage <= 75) severity = 'High';
      else severity = 'Very High';
    } else if (result.type === 'anxiety') {
      if (percentage <= 25) severity = 'Low';
      else if (percentage <= 50) severity = 'Moderate';
      else if (percentage <= 75) severity = 'High';
      else severity = 'Very High';
    }
    
    return {
      type: result.type,
      score: result.score,
      maxScore: result.maxScore,
      percentage,
      severity,
      level: result.level
    };
  });

  try {
    const prompt = `
You are a professional mental health counselor and psychologist. Based on the user's completed three mental health assessment results, please provide personalized mental health advice and improvement plans.

User Assessment Results:
${assessmentDetails.map(result => `
${result.type === 'mental' ? 'Mental Health Assessment' : result.type === 'stress' ? 'Stress Assessment' : 'Anxiety Assessment'}:
- Score: ${result.score}/${result.maxScore} (${result.percentage}%)
- Severity: ${result.severity}
- Assessment Level: ${result.level}
`).join('\n')}

Please provide personalized recommendations in the following JSON format based on the above assessment results. IMPORTANT: Return ONLY the JSON object, no additional text, no markdown formatting:

{
  "summary": "Brief summary of the user's current mental health status (2-3 sentences)",
  "recommendations": [
    "Specific improvement suggestion 1",
    "Specific improvement suggestion 2", 
    "Specific improvement suggestion 3",
    "Specific improvement suggestion 4",
    "Specific improvement suggestion 5"
  ],
  "activities": [
    "Recommended activity 1 (e.g., deep breathing exercises, meditation, walking)",
    "Recommended activity 2",
    "Recommended activity 3",
    "Recommended activity 4",
    "Recommended activity 5"
  ],
  "tips": [
    "Practical life tip 1",
    "Practical life tip 2",
    "Practical life tip 3",
    "Practical life tip 4",
    "Practical life tip 5"
  ]
}

Important notes:
1. Suggestions should be specific, practical, and actionable
2. Language should be warm, encouraging, and positive
3. If assessment results show serious issues, recommend seeking professional help
4. All suggestions should be in English
5. Return ONLY the JSON object, no additional text or formatting
6. Do not include "resources" field in the response
`;

    console.log('📤 Sending request to DeepSeek API...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional mental health counselor. Please provide personalized, practical, and warm mental health advice based on the user\'s assessment results. Return only JSON format response.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📥 Received response from DeepSeek API:', response.status);
    
    const content = response.data.choices[0].message.content;
    
    // Parse JSON response
    try {
      // First try to extract JSON from markdown if present
      let jsonContent = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
        console.log('📝 Extracted JSON from markdown block');
      }
      
      const advice = JSON.parse(jsonContent);
      console.log('✅ Successfully parsed mental health advice:', advice);
      
      // Validate the advice structure
      if (!advice.summary || !advice.recommendations || !advice.activities || !advice.tips) {
        throw new Error('Invalid advice structure received from API');
      }
      
      return {
        code: 200,
        message: 'Success',
        data: advice
      };
    } catch (parseError) {
      console.error('❌ Error parsing DeepSeek response:', parseError);
      console.error('📄 Raw content:', content);
      
      // Only return fallback if we really can't parse the API response
      console.log('🔄 Using fallback advice due to parsing error');
      return {
        code: 200,
        message: 'Success',
        data: getFallbackAdvice(assessmentDetails)
      };
    }
  } catch (error) {
    console.error('❌ Error calling DeepSeek API:', error);
    if (axios.isAxiosError(error)) {
      console.error('📡 API Error details:', error.response?.data);
      console.error('📡 API Error status:', error.response?.status);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        return {
          code: 401,
          message: 'API authentication failed. Please check your API key.',
          data: getFallbackAdvice(assessmentDetails)
        };
      }
      
      // Check if it's a rate limit error
      if (error.response?.status === 429) {
        return {
          code: 429,
          message: 'API rate limit exceeded. Please try again later.',
          data: getFallbackAdvice(assessmentDetails)
        };
      }
    }
    
    // Return fallback advice only for network or server errors
    console.log('🔄 Using fallback advice due to API error');
    return {
      code: 500,
      message: 'Failed to connect to AI service. Using fallback advice.',
      data: getFallbackAdvice(assessmentDetails)
    };
  }
};

export interface ChatResponse {
  message: string;
  mood: 'positive' | 'neutral' | 'concerned' | 'supportive';
  suggestions?: string[];
}

export const getMentalHealthChatResponse = async (
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ApiResponse<ChatResponse>> => {
  console.log('💬 Getting mental health chat response for:', userMessage);
  
  try {
    const systemPrompt = `You are Nikky, a friendly and empathetic AI mental health assistant. You are represented by a cute chick character and should respond in a warm, supportive manner.

Your role is to:
1. Listen empathetically to users' mental health concerns
2. Provide supportive and helpful responses
3. Offer gentle suggestions when appropriate
4. Maintain a positive, encouraging tone
5. Never give medical advice - encourage professional help when needed

Respond naturally as if you're having a friendly conversation. Keep responses conversational and not too long.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: userMessage }
    ];

    console.log('📤 Sending chat request to DeepSeek API...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📥 Received chat response from DeepSeek API:', response.status);
    
    const content = response.data.choices[0].message.content;
    console.log('💬 AI Response:', content);

    // Analyze the response to determine mood
    const mood = analyzeResponseMood(content);
    
    const chatResponse: ChatResponse = {
      message: content,
      mood,
      suggestions: mood === 'concerned' ? [
        'Consider talking to a mental health professional',
        'Try some relaxation techniques',
        'Reach out to friends or family for support'
      ] : undefined
    };

    return {
      code: 200,
      data: chatResponse,
      message: 'Chat response generated successfully'
    };

  } catch (error) {
    console.error('❌ Error calling DeepSeek API for chat:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('📡 API Error details:', error.response?.data);
      console.error('📡 API Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        return {
          code: 401,
          data: {
            message: 'API authentication failed. Please check your API key.',
            mood: 'neutral'
          },
          message: 'API authentication failed. Please check your API key.'
        };
      }
      
      if (error.response?.status === 429) {
        return {
          code: 429,
          data: {
            message: 'API rate limit exceeded. Please try again later.',
            mood: 'neutral'
          },
          message: 'API rate limit exceeded. Please try again later.'
        };
      }
    }

    console.log('🔄 Using fallback chat response due to API error');
    
    // Return a fallback response
    const fallbackResponse: ChatResponse = {
      message: getFallbackChatResponse(userMessage),
      mood: 'supportive'
    };

    return {
      code: 200,
      data: fallbackResponse,
      message: 'Using fallback response due to API error'
    };
  }
};

const analyzeResponseMood = (content: string): 'positive' | 'neutral' | 'concerned' | 'supportive' => {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('worry') || lowerContent.includes('concern') || lowerContent.includes('serious')) {
    return 'concerned';
  }
  
  if (lowerContent.includes('great') || lowerContent.includes('wonderful') || lowerContent.includes('excellent')) {
    return 'positive';
  }
  
  if (lowerContent.includes('support') || lowerContent.includes('help') || lowerContent.includes('listen')) {
    return 'supportive';
  }
  
  return 'neutral';
};

const getFallbackChatResponse = (userMessage: string): string => {
  const responses = [
    'I understand how you\'re feeling. Can you tell me more about this situation?',
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

const getFallbackAdvice = (assessmentDetails: any[]): MentalHealthAdvice => {
  console.log('🔄 Generating fallback advice...');
  
  const hasHighStress = assessmentDetails.some((d: any) => d.type === 'stress' && d.percentage > 50);
  const hasHighAnxiety = assessmentDetails.some((d: any) => d.type === 'anxiety' && d.percentage > 50);
  const isUnstable = assessmentDetails.some((d: any) => d.type === 'mental' && d.severity === 'Unstable');
  
  let summary = 'Based on your assessment results, your mental health status is generally good.';
  let recommendations = [
    'Maintain regular sleep patterns and ensure adequate rest',
    'Engage in moderate physical exercise regularly',
    'Maintain good communication with family and friends',
    'Develop positive hobbies and interests',
    'Learn relaxation and stress reduction techniques'
  ];
  
  if (hasHighStress || hasHighAnxiety || isUnstable) {
    summary = 'Based on your assessment results, we recommend paying attention to your mental health and taking positive improvement measures.';
    recommendations = [
      'Consider seeking professional counseling or therapy',
      'Learn stress management and relaxation techniques',
      'Establish healthy lifestyle habits',
      'Share your feelings with trusted people',
      'Avoid excessive self-criticism and learn self-acceptance'
    ];
  }
  
  return {
    summary,
    recommendations,
    activities: [
      'Deep breathing exercises (5-10 minutes daily)',
      'Progressive muscle relaxation',
      'Mindfulness meditation',
      'Outdoor walking',
      'Listening to soothing music'
    ],
    tips: [
      'Maintain regular sleep patterns',
      'Exercise moderately, at least 150 minutes per week',
      'Stay connected with friends and family',
      'Develop positive hobbies and interests',
      'Learn to say "no" and set healthy boundaries'
    ]
  };
}; 

// User Mood Record Types
export interface UserMoodRecord {
  id: number;
  userId: number;
  totalEvaluation: 'Stable' | 'Unstable';
  stressValue: number;
  todaysMood: 'Very good' | 'Good' | 'Sad' | 'Depressed';
  recordTime: string;
}

// Get all user mood records
export const getUserMoods = async (): Promise<ApiResponse<UserMoodRecord[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    const response = await axios.get<ApiResponse<UserMoodRecord[]>>(`${API_BASE_URL}/user-moods`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user moods:', error);
    throw error;
  }
};

// Create a new user mood record
export const createUserMood = async (data: { totalEvaluation: 'Stable' | 'Unstable'; stressValue: number }): Promise<ApiResponse<UserMoodRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    const response = await axios.post<ApiResponse<UserMoodRecord>>(`${API_BASE_URL}/user-moods`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating user mood:', error);
    throw error;
  }
};

// Update an existing user mood record
export const updateUserMood = async (id: number, data: { totalEvaluation: 'Stable' | 'Unstable'; stressValue: number }): Promise<ApiResponse<UserMoodRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    const response = await axios.put<ApiResponse<UserMoodRecord>>(`${API_BASE_URL}/user-moods/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating user mood:', error);
    throw error;
  }
}; 

// 获取单条心情记录
export const getUserMoodById = async (id: number | string): Promise<ApiResponse<UserMoodRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    const response = await axios.get<ApiResponse<UserMoodRecord>>(`${API_BASE_URL}/user-moods/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user mood by id:', error);
    throw error;
  }
}; 