import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.REACT_APP_DEEPSEEK_API_KEY || 'sk-1555560e750b4bcb806c65171aa78f7e';

// 运动咨询聊天响应接口
export interface ExerciseChatResponse {
  message: string;
  suggestions?: string[];
}

export interface ExerciseRecommendation {
  'Strength Training': {
    'Upper Limbs': string;
    'Lower Limbs': string;
    'Core': string;
    'Other': string;
  };
  'Cardio Training': {
    'Name': string;
    'Method': string;
    'Duration': string;
    'Intensity': string;
  };
  'Flexibility Training': {
    'Type': string;
    'Method': string;
    'Duration': string;
  };
  'Weekly Schedule': {
    'Monday': string;
    'Tuesday': string;
    'Wednesday': string;
    'Thursday': string;
    'Friday': string;
    'Saturday': string;
    'Sunday': string;
  };
}

export interface UserComprehensiveData {
  profile: {
    id?: number;
    userId?: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    occupation: string;
    favoriteSport: string;
    height?: number;
    weight?: number;
    bmi?: number;
  };
  activities: any[];
  dietaryRecords: any[];
  recentStats: {
    totalSteps: number;
    totalCalories: number;
    totalDuration: number;
    avgHeartRate: number;
  };
}

export const generateWeeklyExerciseRecommendation = async (userData: UserComprehensiveData): Promise<ExerciseRecommendation> => {
  console.log('🔍 Starting recommendation generation with user data:', userData);
  
  try {
    const prompt = `
You are a professional fitness coach and health advisor. Based on the comprehensive user data provided, generate a personalized weekly exercise recommendation.

User Profile:
- Name: ${userData.profile.firstName} ${userData.profile.lastName}
- Age: ${userData.profile.age}
- Gender: ${userData.profile.gender}
- Occupation: ${userData.profile.occupation}
- Favorite Sport: ${userData.profile.favoriteSport}
- Height: ${userData.profile.height || 'Not provided'}cm
- Weight: ${userData.profile.weight || 'Not provided'}kg
- BMI: ${userData.profile.bmi || 'Not calculated'}

Recent Exercise Statistics:
- Total Steps: ${userData.recentStats.totalSteps}
- Total Calories Burned: ${userData.recentStats.totalCalories}
- Total Exercise Duration: ${userData.recentStats.totalDuration} minutes
- Average Heart Rate: ${userData.recentStats.avgHeartRate} bpm

Recent Activities (last 7 days):
${userData.activities.map(activity => `- ${activity.exerciseType}: ${activity.duration}min, ${activity.calories}cal, ${activity.steps} steps`).join('\n')}

Dietary Records Summary:
${userData.dietaryRecords.length > 0 ? `Average daily calories: ${userData.dietaryRecords.reduce((sum, record) => sum + record.totalCalories, 0) / userData.dietaryRecords.length}` : 'No dietary records available'}

Please provide a comprehensive weekly exercise recommendation in the following JSON format. All recommendations should be in English and tailored to the user's specific profile, current fitness level, and goals.

{
  "Strength Training": {
    "Upper Limbs": "Specific exercises for arms, shoulders, chest (e.g., push-ups, dumbbell press)",
    "Lower Limbs": "Specific exercises for legs, glutes (e.g., squats, lunges)",
    "Core": "Specific core strengthening exercises (e.g., planks, crunches)",
    "Other": "Additional strength training recommendations"
  },
  "Cardio Training": {
    "Name": "Main cardio activity name",
    "Method": "Specific method or technique",
    "Duration": "Recommended duration",
    "Intensity": "Recommended intensity level"
  },
  "Flexibility Training": {
    "Type": "Type of flexibility training",
    "Method": "Specific stretching or flexibility method",
    "Duration": "Recommended duration"
  },
  "Weekly Schedule": {
    "Monday": "Specific workout plan for Monday",
    "Tuesday": "Specific workout plan for Tuesday",
    "Wednesday": "Specific workout plan for Wednesday",
    "Thursday": "Specific workout plan for Thursday",
    "Friday": "Specific workout plan for Friday",
    "Saturday": "Specific workout plan for Saturday",
    "Sunday": "Specific workout plan for Sunday"
  }
}

Consider the user's:
1. Current fitness level based on recent activities
2. Age and gender for appropriate exercise intensity
3. Occupation (sedentary/active) for targeted exercises
4. Favorite sport for motivation
5. BMI for health considerations
6. Recent exercise patterns for progressive improvement

Provide only the JSON response without any additional text or formatting.`;

    console.log('📤 Sending request to Deepseek API...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness coach. Always respond with valid JSON format only.'
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

    console.log('📥 Received response from Deepseek API:', response.status);
    console.log('📄 Response content:', response.data.choices[0].message.content);

    const content = response.data.choices[0].message.content;
    
    // Parse the JSON response
    try {
      const recommendation = JSON.parse(content);
      console.log('✅ Successfully parsed AI recommendation:', recommendation);
      return recommendation;
    } catch (parseError) {
      console.error('❌ Error parsing Deepseek response:', parseError);
      console.error('📄 Raw content:', content);
      // Return a fallback recommendation
      return getFallbackRecommendation(userData);
    }
  } catch (error) {
    console.error('❌ Error calling Deepseek API:', error);
    if (axios.isAxiosError(error)) {
      console.error('📡 API Error details:', error.response?.data);
      console.error('📡 API Error status:', error.response?.status);
    }
    // Return a fallback recommendation
    return getFallbackRecommendation(userData);
  }
};

const getFallbackRecommendation = (userData: UserComprehensiveData): ExerciseRecommendation => {
  console.log('🔄 Generating fallback recommendation for user:', userData.profile.firstName);
  
  const { profile, recentStats, activities } = userData;
  const isBeginnerLevel = recentStats.totalDuration < 150; // Less than 150 minutes per week
  const isHighActivity = recentStats.totalDuration > 300; // More than 300 minutes per week
  const age = profile.age;
  const gender = profile.gender;
  const occupation = profile.occupation;
  const favoriteSport = profile.favoriteSport;
  
  // Generate personalized recommendations based on user data
  const personalizedRecommendation: ExerciseRecommendation = {
    'Strength Training': {
      'Upper Limbs': getUpperLimbsRecommendation(isBeginnerLevel, isHighActivity, age, gender, favoriteSport),
      'Lower Limbs': getLowerLimbsRecommendation(isBeginnerLevel, isHighActivity, age, gender, favoriteSport),
      'Core': getCoreRecommendation(isBeginnerLevel, isHighActivity, age, gender),
      'Other': getOtherStrengthRecommendation(favoriteSport, occupation, age)
    },
    'Cardio Training': {
      'Name': getCardioName(favoriteSport, age, isBeginnerLevel),
      'Method': getCardioMethod(isBeginnerLevel, isHighActivity, age, gender),
      'Duration': getCardioDuration(isBeginnerLevel, isHighActivity, age),
      'Intensity': getCardioIntensity(isBeginnerLevel, isHighActivity, age, gender)
    },
    'Flexibility Training': {
      'Type': getFlexibilityType(age, occupation, favoriteSport),
      'Method': getFlexibilityMethod(age, occupation, isBeginnerLevel),
      'Duration': getFlexibilityDuration(age, isBeginnerLevel)
    },
    'Weekly Schedule': getWeeklySchedule(isBeginnerLevel, isHighActivity, age, gender, favoriteSport, occupation)
  };
  
  console.log('🎯 Generated personalized fallback recommendation:', personalizedRecommendation);
  return personalizedRecommendation;
};

// Helper functions for personalized recommendations
const getUpperLimbsRecommendation = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string, favoriteSport: string): string => {
  if (isBeginnerLevel) {
    return `Wall push-ups (3 sets of 8-12), Modified push-ups (2 sets of 5-8), Arm circles (2 sets of 10). Focus on proper form for ${favoriteSport ? favoriteSport : 'basic movements'}.`;
  } else if (isHighActivity) {
    return `Advanced push-ups (4 sets of 20-25), Pike push-ups (3 sets of 12-15), Tricep dips (3 sets of 15), ${favoriteSport === 'swimming' ? 'shoulder blade squeezes' : 'diamond push-ups'}. Suitable for ${age < 30 ? 'high-intensity' : 'moderate-intensity'} training.`;
  } else {
    return `Standard push-ups (3 sets of 12-18), Incline push-ups (3 sets of 10-15), Arm strengthening exercises tailored for ${gender === 'female' ? 'women' : 'men'} aged ${age}.`;
  }
};

const getLowerLimbsRecommendation = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string, favoriteSport: string): string => {
  if (isBeginnerLevel) {
    return `Chair squats (3 sets of 10-15), Wall sit (2 sets of 20-30 seconds), Gentle lunges (2 sets of 8 each leg). Perfect for starting ${favoriteSport ? favoriteSport : 'fitness'} journey.`;
  } else if (isHighActivity) {
    return `Jump squats (4 sets of 15-20), Single-leg squats (3 sets of 8-12), Plyometric lunges (3 sets of 12 each leg), ${favoriteSport === 'running' ? 'calf raises' : 'lateral lunges'}. High-intensity for ${age < 35 ? 'young athletes' : 'experienced practitioners'}.`;
  } else {
    return `Regular squats (3 sets of 15-20), Forward lunges (3 sets of 12 each leg), Glute bridges (3 sets of 15), specifically designed for ${gender === 'female' ? 'women' : 'men'} in ${age < 40 ? 'their prime' : 'mature years'}.`;
  }
};

const getCoreRecommendation = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string): string => {
  if (isBeginnerLevel) {
    return `Modified plank (3 sets of 20-30 seconds), Knee-to-chest (2 sets of 10), Dead bug (2 sets of 8 each side). Gentle core strengthening for ${gender === 'female' ? 'women' : 'men'} aged ${age}.`;
  } else if (isHighActivity) {
    return `Plank variations (4 sets of 60-90 seconds), Russian twists (3 sets of 20), Mountain climbers (3 sets of 30), Bicycle crunches (3 sets of 20). Advanced core training for ${age < 30 ? 'high-performance' : 'experienced'} individuals.`;
  } else {
    return `Standard plank (3 sets of 45-60 seconds), Side planks (2 sets of 30-45 seconds each), Crunches (3 sets of 15), tailored for ${age < 50 ? 'middle-aged' : 'mature'} fitness enthusiasts.`;
  }
};

const getOtherStrengthRecommendation = (favoriteSport: string, occupation: string, age: number): string => {
  const sportSpecific = favoriteSport ? `${favoriteSport}-specific strength training exercises` : 'functional strength movements';
  const occupationSpecific = occupation.toLowerCase().includes('office') || occupation.toLowerCase().includes('desk') ? 
    'focus on posture correction and back strengthening' : 'enhance overall functional strength';
  
  return `${sportSpecific} with ${occupationSpecific}. Include resistance band exercises suitable for ${age < 40 ? 'young adults' : 'mature adults'} lifestyle.`;
};

const getCardioName = (favoriteSport: string, age: number, isBeginnerLevel: boolean): string => {
  if (favoriteSport && !isBeginnerLevel) {
    return favoriteSport;
  } else if (age > 50) {
    return 'Low-impact walking';
  } else if (isBeginnerLevel) {
    return 'Brisk walking';
  } else {
    return 'Moderate jogging';
  }
};

const getCardioMethod = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string): string => {
  if (isBeginnerLevel) {
    return `Start with 15-20 minutes of gentle activity, gradually increasing intensity. Focus on consistency rather than intensity for ${gender === 'female' ? 'women' : 'men'} aged ${age}.`;
  } else if (isHighActivity) {
    return `Interval training with 2-minute high-intensity bursts followed by 1-minute recovery periods. Advanced cardiovascular conditioning for ${age < 35 ? 'young athletes' : 'experienced practitioners'}.`;
  } else {
    return `Steady-state cardio with moderate intensity for 25-35 minutes. Maintain conversation pace suitable for ${age < 45 ? 'middle-aged' : 'mature'} individuals.`;
  }
};

const getCardioDuration = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number): string => {
  if (isBeginnerLevel) {
    return `15-25 minutes, 3-4 times per week`;
  } else if (isHighActivity) {
    return `40-60 minutes, 5-6 times per week`;
  } else {
    return age > 50 ? '25-35 minutes, 4-5 times per week' : '30-45 minutes, 4-5 times per week';
  }
};

const getCardioIntensity = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string): string => {
  const maxHR = 220 - age;
  if (isBeginnerLevel) {
    return `Low to moderate intensity (50-65% max heart rate, approximately ${Math.round(maxHR * 0.5)}-${Math.round(maxHR * 0.65)} bpm)`;
  } else if (isHighActivity) {
    return `High intensity intervals (75-90% max heart rate, approximately ${Math.round(maxHR * 0.75)}-${Math.round(maxHR * 0.9)} bpm)`;
  } else {
    return `Moderate intensity (65-75% max heart rate, approximately ${Math.round(maxHR * 0.65)}-${Math.round(maxHR * 0.75)} bpm)`;
  }
};

const getFlexibilityType = (age: number, occupation: string, favoriteSport: string): string => {
  if (age > 50) {
    return 'Gentle stretching and mobility work';
  } else if (occupation.toLowerCase().includes('office') || occupation.toLowerCase().includes('desk')) {
    return 'Desk worker flexibility routine';
  } else if (favoriteSport) {
    return `${favoriteSport}-specific stretching and mobility`;
  } else {
    return 'Dynamic and static stretching';
  }
};

const getFlexibilityMethod = (age: number, occupation: string, isBeginnerLevel: boolean): string => {
  if (isBeginnerLevel) {
    return `Gentle static stretches held for 15-30 seconds, focusing on major muscle groups. Include neck and shoulder stretches for ${occupation.toLowerCase().includes('office') ? 'office workers' : 'daily activities'}.`;
  } else if (age > 50) {
    return `Combination of gentle yoga poses and static stretching, with emphasis on joint mobility and balance. Hold stretches for 30-60 seconds.`;
  } else {
    return `Dynamic warm-up stretches followed by static cool-down stretches. Include sport-specific movements and full-body flexibility routine.`;
  }
};

const getFlexibilityDuration = (age: number, isBeginnerLevel: boolean): string => {
  if (isBeginnerLevel) {
    return '10-15 minutes daily';
  } else if (age > 50) {
    return '15-20 minutes daily';
  } else {
    return '10-15 minutes daily';
  }
};

const getWeeklySchedule = (isBeginnerLevel: boolean, isHighActivity: boolean, age: number, gender: string, favoriteSport: string, occupation: string): { Monday: string; Tuesday: string; Wednesday: string; Thursday: string; Friday: string; Saturday: string; Sunday: string } => {

  if (isBeginnerLevel) {
    return {
      'Monday': `Gentle upper body strength (15-20 min) + light stretching for ${occupation.toLowerCase().includes('office') ? 'office workers' : 'beginners'}`,
      'Tuesday': `20-minute walk + lower body exercises suitable for ${gender === 'female' ? 'women' : 'men'} aged ${age}`,
      'Wednesday': `Core strengthening (10-15 min) + flexibility routine`,
      'Thursday': `Upper body strength + cardio (15-20 min total)`,
      'Friday': `Lower body strength + stretching session`,
      'Saturday': `${favoriteSport ? favoriteSport + ' practice' : 'Recreational activity'} (20-30 min) + full body stretch`,
      'Sunday': `Rest day with gentle stretching and mobility work`
    };
  } else if (isHighActivity) {
    return {
      'Monday': `High-intensity upper body strength (30-40 min) + ${favoriteSport ? favoriteSport + ' training' : 'cardio intervals'}`,
      'Tuesday': `Advanced lower body workout (35-45 min) + core training suitable for ${age < 30 ? 'young athletes' : 'experienced practitioners'}`,
      'Wednesday': `Cardio intervals (40-50 min) + flexibility routine`,
      'Thursday': `Upper body strength + sport-specific training (45-60 min)`,
      'Friday': `Lower body power training + high-intensity cardio`,
      'Saturday': `${favoriteSport ? favoriteSport + ' competition/practice' : 'Cross-training'} (60-90 min) + recovery stretching`,
      'Sunday': `Active recovery: light ${favoriteSport ? favoriteSport : 'activity'} + extensive stretching session`
    };
  } else {
    return {
      'Monday': `Upper body strength training (25-30 min) + moderate cardio suitable for ${gender === 'female' ? 'women' : 'men'} aged ${age}`,
      'Tuesday': `Lower body strength (25-30 min) + flexibility routine`,
      'Wednesday': `Cardio training (30-35 min) + core strengthening`,
      'Thursday': `Upper body strength + sport-specific movements (30-40 min)`,
      'Friday': `Lower body training + moderate cardio session`,
      'Saturday': `${favoriteSport ? favoriteSport + ' practice' : 'Recreational activity'} (45-60 min) + full body stretch`,
      'Sunday': `Rest day with gentle yoga or stretching (15-20 min)`
    };
  }
}

// 运动咨询聊天API函数
export const getExerciseChatResponse = async (
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ExerciseChatResponse> => {
  console.log('💬 Getting exercise chat response for:', userMessage);

  try {
    const systemPrompt = `You are an experienced fitness coach and exercise specialist. Your role is to:

1. **Provide professional, personalized exercise advice and guidance**
2. **Help users create workout plans** based on their fitness level and goals
3. **Offer suggestions for proper form, techniques, and safety**
4. **Recommend exercises** for different muscle groups and fitness objectives
5. **Provide motivation and support** for users' fitness journeys
6. **Answer questions about nutrition** as it relates to exercise performance
7. **Suggest modifications** for injuries or physical limitations

**Important formatting guidelines:**
- Use **bold text** for key points and exercise names
- Use *italics* for emphasis on important safety notes
- Use numbered or bulleted lists for exercise routines and tips
- Use \`code formatting\` for specific rep counts, weights, or durations
- Break down complex information into clear, digestible sections

Always respond in a friendly, supportive, and professional manner. Keep your responses practical and actionable. If a user asks about serious injuries or medical conditions, advise them to consult with a healthcare professional.

**Format your responses using markdown** to make them easy to read and visually appealing. Respond naturally as if you're having a conversation with a client at the gym.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: userMessage }
    ];

    console.log('📤 Sending exercise chat request to DeepSeek API...');

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 600,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('📥 Received exercise chat response from DeepSeek API:', response.status);

    const content = response.data.choices[0].message.content;
    console.log('💬 Exercise AI Response:', content);

    const chatResponse: ExerciseChatResponse = {
      message: content
    };

    return chatResponse;

  } catch (error) {
    console.error('❌ Error calling DeepSeek API for exercise chat:', error);

    if (axios.isAxiosError(error)) {
      console.error('📡 API Error details:', error.response?.data);
      console.error('📡 API Error status:', error.response?.status);

      if (error.response?.status === 401) {
        throw new Error('API authentication failed. Please check your API key.');
      }

      if (error.response?.status === 429) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
    }

    console.log('🔄 Using fallback exercise chat response due to API error');

    // 返回备用响应
    return {
      message: getFallbackExerciseChatResponse(userMessage)
    };
  }
};

// 备用运动咨询响应函数
const getFallbackExerciseChatResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();
  
  if (message.includes('beginner') || message.includes('start') || message.includes('new')) {
    return `## 🌟 Perfect Starting Point for Beginners!

For beginners, I recommend starting with **bodyweight exercises**:

- **Squats** - Build lower body strength
- **Push-ups** - Develop upper body and core
- **Lunges** - Improve balance and leg strength

### Getting Started
- Start with \`2-3 sets\` of \`8-12 repetitions\`
- *Focus on proper form rather than speed*
- Take \`60-90 seconds\` rest between sets

Remember: *Consistency beats intensity when starting out!*`;
  }
  
  if (message.includes('frequency') || message.includes('how often') || message.includes('how many times')) {
    return `## 📅 Optimal Exercise Frequency

### **Weekly Exercise Guidelines:**
- **Cardio**: \`150 minutes\` of moderate-intensity exercise per week
- **Strength Training**: \`2-3 days\` per week
- **Rest Days**: *Essential for recovery and muscle growth*

### **Sample Weekly Schedule:**
- **5 days**: \`30 minutes\` moderate exercise
- **2-3 days**: Strength training
- **1-2 days**: Complete rest or gentle stretching`;
  }
  
  if (message.includes('diet') || message.includes('eat') || message.includes('nutrition')) {
    return `## 🥗 Nutrition for Exercise Performance

### **Key Nutritional Principles:**
- **Protein**: \`0.8-1g per kg\` body weight for muscle recovery
- **Complex Carbs**: Fuel for your workouts
- **Hydration**: *Stay well-hydrated throughout the day*

### **Meal Timing:**
- **Pre-workout**: Balanced meal \`2-3 hours\` before
- **Post-workout**: Protein-rich snack within \`30 minutes\`

*Remember: Nutrition is 70% of your fitness journey!*`;
  }
  
  if (message.includes('recovery') || message.includes('rest') || message.includes('sore') || message.includes('tired')) {
    return `## 😴 Recovery is Just as Important!

### **Essential Recovery Strategies:**
- **Sleep**: \`7-9 hours\` of quality sleep
- **Hydration**: Keep drinking water
- **Gentle Movement**: Light stretching or yoga
- **Active Recovery**: Easy walks on rest days

### **Listen to Your Body:**
*If you're very sore or tired, take an extra rest day. Your muscles grow during rest, not during the workout!*`;
  }
  
  if (message.includes('weight loss') || message.includes('lose weight') || message.includes('burn fat')) {
    return `## 🔥 Effective Weight Loss Strategy

### **The Winning Combination:**
1. **Cardio** - Burns calories during exercise
2. **Strength Training** - Builds muscle that burns calories at rest
3. **Nutrition** - Create a moderate calorie deficit

### **Recommended Approach:**
- **HIIT Training**: High-intensity interval training
- **Strength Training**: \`2-3 times\` per week
- **Consistent Cardio**: \`3-4 times\` per week

*Remember: Sustainable weight loss is about 1-2 pounds per week!*`;
  }
  
  if (message.includes('muscle') || message.includes('gain') || message.includes('build') || message.includes('strong')) {
    return `## 💪 Building Muscle Effectively

### **Key Principles:**
- **Progressive Overload**: Gradually increase weight, reps, or sets
- **Compound Exercises**: Work multiple muscle groups

### **Best Compound Movements:**
- **Squats** - Full body strength
- **Deadlifts** - Posterior chain power
- **Bench Press** - Upper body development

### **Recovery Essentials:**
- **Protein**: \`1.2-2g per kg\` body weight
- **Rest**: *Muscles grow during recovery*
- **Sleep**: \`7-9 hours\` for optimal growth hormone`;
  }
  
  if (message.includes('home') || message.includes('no gym') || message.includes('equipment')) {
    return `## 🏠 Excellent Home Workouts!

### **No Equipment Needed:**
- **Push-ups** - Upper body and core
- **Squats** - Lower body strength
- **Lunges** - Balance and leg power
- **Planks** - Core stability
- **Burpees** - Full body cardio

### **Creative Equipment Ideas:**
- **Water bottles** - Light weights
- **Books** - Heavier weights
- **Resistance bands** - Affordable and space-saving

### **Resources:**
- **YouTube** has many free workout videos
- *Start with 20-30 minute sessions*`;
  }
  
  // 默认响应
  return `## 💬 Great Question!

As your **fitness coach**, I'm here to help you achieve your goals! 

### **To provide better guidance, could you tell me:**
- Your current **fitness level**
- Any specific **goals** you have
- What aspect of **exercise** interests you most

This will help me provide more **personalized advice** tailored just for you! 🎯`;
};

export default {
  generateWeeklyExerciseRecommendation
}; 