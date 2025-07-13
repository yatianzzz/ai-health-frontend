import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface UserComprehensiveData {
  profile: {
    id?: number;
    userId: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    occupation: string;
    favoriteSport: string;
  };
  activities: Array<{
    id: number;
    userId: number;
    height: number;
    weight: number;
    bmi: number;
    activityDate: string;
    duration: number;
    exerciseType: string;
    steps: number;
    calories: number;
    maxHeartRate?: number;
    minHeartRate?: number;
  }>;
  dietaryRecords: Array<{
    id: number;
    userId: number;
    recordDate: string;
    recordTime: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    mealType: string;
    notes: string;
    totalCalories: number;
    createTime: string;
  }>;
  stats: {
    totalSteps: number;
    totalCalories: number;
    totalDuration: number;
    avgHeartRate: number;
    totalDietaryRecords: number;
    avgDailyCalories: number;
    recentActivitiesCount: number;
  };
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const getUserComprehensiveData = async (): Promise<ApiResponse<UserComprehensiveData>> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user-data/comprehensive`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user comprehensive data:', error);
    throw error;
  }
};

export const getUserStats = async (): Promise<ApiResponse<UserComprehensiveData['stats']>> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user-data/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

const userDataAPI = {
  getUserComprehensiveData,
  getUserStats
};

export default userDataAPI; 