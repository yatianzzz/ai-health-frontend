import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = 'http://localhost:8080';


export const getUserDietaryRecords = async (userId: string, startDate?: string, endDate?: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    let url = `${API_BASE_URL}/diet/records/${userId}`;
    
  
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dietary records:', error);
    message.error('Failed to load dietary records');
    throw error;
  }
};


export const saveDietaryRecord = async (dietaryData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.post(`${API_BASE_URL}/diet/records`, dietaryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error saving dietary record:', error);
    message.error('Failed to save dietary record');
    throw error;
  }
};


export const getCalorieComparisonData = async (userId: string, period: 'day' | 'week' | 'month' = 'week') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.get(`${API_BASE_URL}/diet/calories/${userId}?period=${period}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching calorie comparison data:', error);
    message.error('Failed to load calorie data');
    throw error;
  }
};


export const getDietarySuggestions = async (userId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.get(`${API_BASE_URL}/diet/suggestions/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dietary suggestions:', error);
    message.error('Failed to load dietary suggestions');
    throw error;
  }
};


export const updateDietaryRecord = async (recordId: string, updatedData: any) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.put(`${API_BASE_URL}/diet/records/${recordId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error updating dietary record:', error);
    message.error('Failed to update dietary record');
    throw error;
  }
};


export const deleteDietaryRecord = async (recordId: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }
    
    const response = await axios.delete(`${API_BASE_URL}/diet/records/${recordId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error deleting dietary record:', error);
    message.error('Failed to delete dietary record');
    throw error;
  }
}; 