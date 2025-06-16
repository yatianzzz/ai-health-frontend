import axios from 'axios';
import { UserProfileData } from '../components/UserProfileForm';

const API_BASE_URL = 'http://localhost:8080';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const saveUserProfile = async (profileData: UserProfileData) => {
  try {
   
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    return {
      code: 200,
      message: 'Profile saved successfully',
      data: profileData
    };
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
   
    const profileData = localStorage.getItem('userProfile');
    
    if (profileData) {
      return {
        code: 200,
        message: 'Profile retrieved successfully',
        data: JSON.parse(profileData)
      };
    }
    
    return {
      code: 404,
      message: 'Profile not found',
      data: null
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const checkProfileExists = async () => {
  try {
   
    return !!localStorage.getItem('userProfile');
  } catch (error) {
    console.error('Error checking if profile exists:', error);
    return false;
  }
};

// 验证token是否有效
export const validateToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
   
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}; 