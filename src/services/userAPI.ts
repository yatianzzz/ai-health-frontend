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
    const response = await axios.post(`${API_BASE_URL}/api/user-profile`, profileData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: UserProfileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/user-profile`, profileData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user-profile`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const deleteUserProfile = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/user-profile`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};

export const checkProfileExists = async () => {
  try {
    const response = await getUserProfile();
    return response.code === 200 && !!response.data;
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
    
    const response = await axios.get(`${API_BASE_URL}/api/validate-token`, {
      headers: getAuthHeader()
    });
    return response.data.code === 200;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
}; 