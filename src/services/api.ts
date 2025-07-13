const DEEPSEEK_API_KEY = 'sk-1555560e750b4bcb806c65171aa78f7e';
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export const sendMessage = async (messages: Message[]): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Deepseek API:', error);
    throw error;
  }
}; 