import axios from 'axios';

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