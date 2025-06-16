// Test API service file for simulating AI chat functionality

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const responses = [
  "Exercise can help improve both physical and mental health. It's generally recommended to engage in at least 150 minutes of moderate-intensity aerobic activity weekly, such as brisk walking, swimming, or cycling. Additionally, include muscle-strengthening activities that involve all major muscle groups on 2 or more days per week.",
  
  "For beginners, it's best to start with low-intensity exercises and gradually increase duration and intensity. Try walking for 30 minutes daily and slowly build up from there. Choosing activities you enjoy will make it easier to maintain consistency.",

  "The appropriate exercise frequency depends on your health status and fitness goals. For general health objectives, 3-5 sessions of 30-60 minutes of moderate-intensity exercise per week is a reasonable schedule. Remember to allow your body time to recover and avoid overtraining.",
  
  "Based on your BMI and exercise habits, I recommend incorporating some strength training into your routine. This not only helps burn more calories but also builds muscle strength and increases metabolism. Adding 2-3 strength training sessions per week, combined with your existing cardio workouts, would provide better results.",
  
  "Proper rest and recovery are crucial for exercise effectiveness. Ensure you get 7-8 hours of quality sleep each night, maintain adequate hydration, and allow muscles 48 hours to recover after intense training. Nutritional supplementation is also key, especially protein intake.",
  
  "A healthy diet should include various nutrients. Consume some carbohydrates before exercise for energy, and protein within 30 minutes after exercise to aid muscle recovery. In your daily diet, incorporate plenty of vegetables, fruits, whole grains, and quality proteins while reducing processed foods and sugar intake."
];

export const sendMessage = async (messages: Message[]): Promise<string> => {
  // Simple simulation of AI response delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the last user message
  const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
  
  if (!lastUserMessage) {
    return "Hello! I'm your exercise health assistant. How can I help you today?";
  }
  
  // Simple matching of responses based on user input
  const userText = lastUserMessage.text.toLowerCase();
  
  if (userText.includes('beginner') || userText.includes('start') || userText.includes('new')) {
    return responses[1];
  } else if (userText.includes('frequency') || userText.includes('how often') || userText.includes('how many times')) {
    return responses[2];
  } else if (userText.includes('diet') || userText.includes('eat') || userText.includes('nutrition')) {
    return responses[5];
  } else if (userText.includes('recovery') || userText.includes('rest') || userText.includes('fatigue')) {
    return responses[4];
  } else if (userText.includes('advice') || userText.includes('plan') || userText.includes('how to')) {
    return responses[3];
  } else {
    // Default response
    return responses[0];
  }
};