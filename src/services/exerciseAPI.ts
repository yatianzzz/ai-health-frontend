import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { ExerciseData } from '../components/ExerciseForm';

const getAuthHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (!token) {
    message.error('Please login to continue');
    // Optionally redirect to login page
    window.location.href = '/login';
    throw new Error('No authentication token found');
  }
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const API_BASE_URL = 'http://localhost:8080';

// Local storage key
// const EXERCISE_STORAGE_KEY = 'exercise_records';

// Mock API response format
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

// Interface matching backend UserActivity
export interface UserActivity {
  id?: number;
  userId?: number;
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
}

interface WeeklySummaryData {
  totalDuration: number;
  totalSteps: number;
  totalCalories: number;
  recordCount: number;
  recordsByDay: { [key: string]: UserActivity[] };
  weeklyRecords: UserActivity[];
}


// Save exercise record
export const saveExerciseData = async (data: ExerciseData): Promise<ApiResponse<UserActivity>> => {
  try {
    // Validate required fields
    if (!data.exerciseType || !data.date || !data.duration || !data.steps || !data.calories || !data.height || !data.weight) {
      throw new Error('Missing required exercise data');
    }

    // Calculate BMI
    const heightInMeters = data.height / 100; // Convert cm to meters
    const bmi = data.weight / (heightInMeters * heightInMeters);

    // Prepare data for backend
    const activityData = {
      height: Number(heightInMeters.toFixed(2)), // Store height in meters
      weight: Number(data.weight),
      bmi: Number(bmi.toFixed(2)),
      activityDate: data.date,
      duration: Number(data.duration),
      exerciseType: data.exerciseType,
      steps: Number(data.steps),
      calories: Number(data.calories),
      maxHeartRate: data.maxHeartRate ? Number(data.maxHeartRate) : null,
      minHeartRate: data.minHeartRate ? Number(data.minHeartRate) : null
    };

    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Please login first');
      window.location.href = '/login';
      throw new Error('No authentication token found');
    }
    const response = await axios.post<ApiResponse<UserActivity>>(
      `${API_BASE_URL}/api/user-activities`, 
      activityData,
      {
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Failed to save exercise record:', {
      error: error,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      requestData: error.config?.data
    });

    if (error.response?.status === 500) {
      message.error('Server error. Please try again later.');
    } else if (error.response?.status === 401) {
      message.error('Session expired. Please login again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 400) {
      message.error(error.response.data?.message || 'Invalid data provided');
    } else {
      message.error('Failed to save exercise record');
    }

    throw {
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to save exercise record',
      data: null
    };
  }
};

// Get weekly exercise summary
export const getWeeklySummary = async (): Promise<ApiResponse<WeeklySummaryData>> => {
  try {
    // 获取过去7天的记录
    const allRecords = await getAllExerciseRecords();
    if (!allRecords.data) {
      throw new Error('No records found');
    }

    // 计算7天前的日期
    // const today = new Date();
    // const sevenDaysAgo = new Date(today);
    // sevenDaysAgo.setDate(today.getDate() - 6);
    
    // // 过滤最近7天的记录
    // const weeklyRecords = allRecords.data.filter(record => {
    //   const recordDate = new Date(record.activityDate);
    //   return recordDate >= sevenDaysAgo && recordDate <= today;
    // });

    // // 按日期分组
    // const recordsByDay: { [key: string]: UserActivity[] } = {};
    // weeklyRecords.forEach(record => {
    //   const day = record.activityDate;
    //   if (!recordsByDay[day]) {
    //     recordsByDay[day] = [];
    //   }
    //   recordsByDay[day].push(record);
    // });

    // 计算6天前的日期（这样就包含了今天在内的7天）
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 设置到今天的最后一刻
    
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    sixDaysAgo.setHours(0, 0, 0, 0); // 设置到6天前的开始
    
    // 过滤最近7天的记录（包含今天）
    const weeklyRecords = allRecords.data.filter(record => {
      const recordDate = new Date(record.activityDate);
      return recordDate >= sixDaysAgo && recordDate <= today;
    });

    // 按日期分组
    const recordsByDay: { [key: string]: UserActivity[] } = {};
    weeklyRecords.forEach(record => {
      const day = record.activityDate.split('T')[0]; // 确保只使用日期部分
      if (!recordsByDay[day]) {
        recordsByDay[day] = [];
      }
      recordsByDay[day].push(record);
    });

    // 计算总计
    const summary = weeklyRecords.reduce((acc, record) => {
      return {
        totalDuration: acc.totalDuration + (record.duration || 0),
        totalSteps: acc.totalSteps + (record.steps || 0),
        totalCalories: acc.totalCalories + (record.calories || 0)
      };
    }, {
      totalDuration: 0,
      totalSteps: 0,
      totalCalories: 0
    });

    return {
      code: 200,
      message: 'Weekly summary retrieved successfully',
      data: {
        ...summary,
        recordCount: weeklyRecords.length,
        recordsByDay,
        weeklyRecords
      }
    };
  } catch (error) {
    console.error('Failed to retrieve weekly summary:', error);
    throw new Error('Failed to retrieve weekly summary');
  }
};

// Get all exercise records
export const getAllExerciseRecords = async (): Promise<ApiResponse<UserActivity[]>> => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Please login first');
      // window.location.href = '/login';
      throw { code: 401, message: 'Authentication required', data: null };
    }

    const response = await axios.get(`${API_BASE_URL}/api/user-activities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // 'Accept': 'application/json'
      },
      validateStatus: (status) => {
        return status < 500; // Resolve only if status code is less than 500
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      message.error('Session expired. Please login again');
      window.location.href = '/login';
      throw { code: 401, message: 'Authentication required', data: null };
    }

    if (!response.data) {
      throw { code: 500, message: 'Invalid response from server', data: null };
    }

    return response.data;
  } catch (error: any) {
    console.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      message.error('Session expired. Please login again');
    window.location.href = '/login';
      throw { code: 401, message: 'Authentication required', data: null };
    }
    
    if (error.response?.data) {
      throw error.response.data;
    }

    throw { 
      code: error.code || 500, 
      message: error.message || 'Failed to retrieve exercise records', 
      data: null 
    };
  }
};

// Get exercise record by id
export const getExerciseRecord = async (id: number): Promise<ApiResponse<UserActivity>> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/user-activities/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve exercise record:', error);
    message.error('Failed to retrieve exercise record');
    throw error;
  }
};


export const getLatestExerciseRecord = async (): Promise<ApiResponse<UserActivity>> => {
  try {
    const response = await getAllExerciseRecords();
    if (response.data && response.data.length > 0) {
      // 获取最新的记录
      const latestRecord = response.data.sort((a, b) => 
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
      )[0];
      return {
        code: 200,
        message: 'Latest record retrieved successfully',
        data: latestRecord
      };
    }
    return {
      code: 404,
      message: 'No records found',
      data: null
    };
  } catch (error) {
    console.error('Failed to get latest exercise record:', error);
    throw error;
  }
};

// Update exercise record
export const updateExerciseRecord = async (id: number, data: ExerciseData): Promise<ApiResponse<any>> => {
  try {
    // Calculate BMI
    const heightInMeters = data.height / 100;
    const bmi = data.weight / (heightInMeters * heightInMeters);

    const activityData = {
      height: Number(data.height),
      weight: Number(data.weight),
      bmi: Number(bmi.toFixed(2)),
      activityDate: data.date,
      duration: Number(data.duration),
      exerciseType: data.exerciseType,
      steps: Number(data.steps),
      calories: Number(data.calories),
      maxHeartRate: data.maxHeartRate ? Number(data.maxHeartRate) : null,
      minHeartRate: data.minHeartRate ? Number(data.minHeartRate) : null
    };

    const response = await axios.put<ApiResponse<UserActivity>>(
      `${API_BASE_URL}/api/user-activities/${id}`, 
      activityData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update exercise record:', error);
    message.error('Failed to update exercise record');
    throw error;
  }
};

// Delete exercise record
export const deleteExerciseRecord = async (id: number): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.delete<ApiResponse<void>>(`
      ${API_BASE_URL}/api/user-activities/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to delete exercise record:', error);
    message.error('Failed to delete exercise record');
    throw error;
  }
};