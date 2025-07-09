import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// ===================== TypeScript Interfaces =====================

export interface RecordTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface DietaryRecord {
  id?: number;
  userId?: number;
  recordDate: string;
  recordTime: RecordTime;
  mealType: string;
  notes: string;
  totalCalories: number;
  createTime?: string;
}

export interface FoodItem {
  id?: number;
  dietaryRecordId: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  calories: number;
  createTime?: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface EmptyData {
  // Empty object for DELETE responses
}

// ===================== Dietary Stats Interfaces =====================

export interface FoodCategoryData {
  type: string;
  value: number;
}

export interface CalorieComparisonData {
  date: string;
  value: number;
  category: 'Consumed' | 'Burned';
}

export interface DailySummaryData {
  caloriesConsumed: number;
  caloriesBurned: number;
  netCalories: number;
  trend: 'up' | 'down';
}

// ===================== Dietary Records =====================

export const getDietaryRecords = async (): Promise<ApiResponse<DietaryRecord[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get<ApiResponse<DietaryRecord[]>>(`${API_BASE_URL}/dietary-records`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dietary records:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const getDietaryRecordById = async (id: string | number): Promise<ApiResponse<DietaryRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get<ApiResponse<DietaryRecord>>(`${API_BASE_URL}/dietary-records/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dietary record:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const createDietaryRecord = async (data: Omit<DietaryRecord, 'id' | 'userId' | 'createTime'>): Promise<ApiResponse<DietaryRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.post<ApiResponse<DietaryRecord>>(`${API_BASE_URL}/dietary-records`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating dietary record:', error);
    return {
      code: error?.response?.data?.code || 500,
      message: error?.response?.data?.message || 'Internal Server Error',
      // @ts-expect-error: returning null to satisfy error response, caller should check code/message
      data: undefined
    };
  }
};

export const updateDietaryRecord = async (id: string | number, data: Omit<DietaryRecord, 'id' | 'userId' | 'createTime'>): Promise<ApiResponse<DietaryRecord>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.put<ApiResponse<DietaryRecord>>(`${API_BASE_URL}/dietary-records/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating dietary record:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const deleteDietaryRecord = async (id: string | number): Promise<ApiResponse<EmptyData>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.delete<ApiResponse<EmptyData>>(`${API_BASE_URL}/dietary-records/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error deleting dietary record:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

// ===================== Food Items =====================

export const getFoodItems = async (recordId: number): Promise<ApiResponse<FoodItem[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.get<ApiResponse<FoodItem[]>>(`${API_BASE_URL}/food-items`, {
      params: { recordId },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching food items:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const getFoodItemById = async (id: string | number): Promise<ApiResponse<FoodItem>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.get<ApiResponse<FoodItem>>(`${API_BASE_URL}/food-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching food item:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const createFoodItem = async (data: Omit<FoodItem, 'id' | 'createTime'>): Promise<ApiResponse<FoodItem>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.post<ApiResponse<FoodItem>>(`${API_BASE_URL}/food-items`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating food item:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const updateFoodItem = async (id: string | number, data: Omit<FoodItem, 'id' | 'createTime'>): Promise<ApiResponse<FoodItem>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.put<ApiResponse<FoodItem>>(`${API_BASE_URL}/food-items/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating food item:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

export const deleteFoodItem = async (id: string | number): Promise<ApiResponse<EmptyData>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');
    
    const response = await axios.delete<ApiResponse<EmptyData>>(`${API_BASE_URL}/food-items/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error deleting food item:', error);
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

// ===================== Additional Diet APIs =====================

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
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
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
    // 静默处理错误，不显示错误消息，因为后端可能没有运行
    throw error;
  }
};

// ===================== Dietary Stats APIs =====================

export const getFoodCategoriesData = async (): Promise<ApiResponse<FoodCategoryData[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get<ApiResponse<FoodCategoryData[]>>(`${API_BASE_URL}/dietary-stats/food-categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching food categories data:', error);
    throw error;
  }
};

export const getCalorieComparisonChartData = async (): Promise<ApiResponse<CalorieComparisonData[]>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get<ApiResponse<CalorieComparisonData[]>>(`${API_BASE_URL}/dietary-stats/calorie-comparison`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching calorie comparison data:', error);
    throw error;
  }
};

export const getDailySummaryData = async (): Promise<ApiResponse<DailySummaryData>> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Authentication token not found');

    const response = await axios.get<ApiResponse<DailySummaryData>>(`${API_BASE_URL}/dietary-stats/daily-summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching daily summary data:', error);
    throw error;
  }
};