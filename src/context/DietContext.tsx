import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useAuth } from './AuthContext';
import { 
  getUserDietaryRecords, 
  saveDietaryRecord, 
  getCalorieComparisonData,
  getDietarySuggestions
} from '../services/dietAPI';

interface DietContextType {
  dietaryRecords: any[];
  calorieData: any[];
  suggestions: any;
  isLoading: boolean;
  addDietaryRecord: (record: any) => Promise<void>;
  fetchDietaryRecords: (startDate?: string, endDate?: string) => Promise<void>;
  fetchCalorieData: (period?: 'day' | 'week' | 'month') => Promise<void>;
  fetchDietarySuggestions: () => Promise<void>;
}

const defaultContext: DietContextType = {
  dietaryRecords: [],
  calorieData: [],
  suggestions: null,
  isLoading: false,
  addDietaryRecord: async () => {},
  fetchDietaryRecords: async () => {},
  fetchCalorieData: async () => {},
  fetchDietarySuggestions: async () => {}
};

const DietContext = createContext<DietContextType>(defaultContext);

export const useDiet = () => useContext(DietContext);

interface DietProviderProps {
  children: ReactNode;
}

export const DietProvider: React.FC<DietProviderProps> = ({ children }) => {
  const [dietaryRecords, setDietaryRecords] = useState<any[]>([]);
  const [calorieData, setCalorieData] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  
  
  const addDietaryRecord = useCallback(async (record: any) => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'current';
      
     
      const recordWithUserId = {
        ...record,
        userId
      };
      
      const response = await saveDietaryRecord(recordWithUserId);
      
      if (response.code === 200) {
        message.success('Dietary record saved successfully!');
        // 更新本地记录
        setDietaryRecords(prev => [response.data, ...prev]);
      } else {
        throw new Error(response.message || 'Failed to save dietary record');
      }
    } catch (error: any) {
      console.error('Error adding dietary record:', error);
      message.error(error.message || 'Failed to save dietary record');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
 
  const fetchDietaryRecords = useCallback(async (startDate?: string, endDate?: string) => {
   
    if (dietaryRecords.length > 0 && !startDate && !endDate) {
      return;
    }
    
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'current';
      
      const response = await getUserDietaryRecords(userId, startDate, endDate);
      
      if (response.code === 200) {
        setDietaryRecords(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch dietary records');
      }
    } catch (error: any) {
      console.error('Error fetching dietary records:', error);
    
      setDietaryRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [dietaryRecords.length]);
  
  const fetchCalorieData = useCallback(async (period: 'day' | 'week' | 'month' = 'week') => {
  
    if (calorieData.length > 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'current';
      
      const response = await getCalorieComparisonData(userId, period);
      
      if (response.code === 200) {
        setCalorieData(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch calorie data');
      }
    } catch (error: any) {
      console.error('Error fetching calorie data:', error);
     
      setCalorieData([]);
    } finally {
      setIsLoading(false);
    }
  }, [calorieData.length]);
  
  
  const fetchDietarySuggestions = useCallback(async () => {
  
    if (suggestions !== null) {
      return;
    }
    
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'current';
      
      const response = await getDietarySuggestions(userId);
      
      if (response.code === 200) {
        setSuggestions(response.data || null);
      } else {
        throw new Error(response.message || 'Failed to fetch dietary suggestions');
      }
    } catch (error: any) {
      console.error('Error fetching dietary suggestions:', error);
      
      setSuggestions(null);
    } finally {
      setIsLoading(false);
    }
  }, [suggestions]);
  
 
  useEffect(() => {
    if (isAuthenticated && !dataFetched) {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
        
          await Promise.all([
            fetchDietaryRecords(),
            fetchCalorieData(),
            fetchDietarySuggestions()
          ]);
          setDataFetched(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadInitialData();
    } else if (!isAuthenticated) {
     
      setDietaryRecords([]);
      setCalorieData([]);
      setSuggestions(null);
      setDataFetched(false);
    }
  }, [isAuthenticated, dataFetched, fetchDietaryRecords, fetchCalorieData, fetchDietarySuggestions]);
 
  const contextValue = React.useMemo(() => ({
    dietaryRecords,
    calorieData,
    suggestions,
    isLoading,
    addDietaryRecord,
    fetchDietaryRecords,
    fetchCalorieData,
    fetchDietarySuggestions
  }), [
    dietaryRecords,
    calorieData,
    suggestions,
    isLoading,
    addDietaryRecord,
    fetchDietaryRecords,
    fetchCalorieData,
    fetchDietarySuggestions
  ]);
  
  return (
    <DietContext.Provider value={contextValue}>
      {children}
    </DietContext.Provider>
  );
}; 