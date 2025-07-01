import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useAuth } from './AuthContext';
import { 
  getDietaryRecords, 
  getFoodItems,
  // saveDietaryRecord, 
  // createDietaryRecord,
  // getCalorieComparisonData, // 暂时注释
  // getDietarySuggestions
} from '../services/dietAPI';

interface DietContextType {
  dietaryRecords: any[];
  foodItems: any[];
  // calorieData: any[]; // 暂时注释
  // suggestions: any;
  isLoading: boolean;
  // addDietaryRecord: (record: any) => Promise<void>;
  fetchDietaryRecords: () => Promise<void>;
  fetchFoodItems: (recordId: number) => Promise<void>;
  // fetchCalorieData: (period?: 'day' | 'week' | 'month') => Promise<void>; // 暂时注释
  // fetchDietarySuggestions: () => Promise<void>;
}

const defaultContext: DietContextType = {
  dietaryRecords: [],
  foodItems: [],
  // calorieData: [], // 暂时注释
  // suggestions: null,
  isLoading: false,
  // addDietaryRecord: async () => {},
  fetchDietaryRecords: async () => {},
  fetchFoodItems: async (_recordId: number) => {},
  // fetchCalorieData: async () => {}, // 暂时注释
  // fetchDietarySuggestions: async () => {}
};

const DietContext = createContext<DietContextType>(defaultContext);

export const useDiet = () => useContext(DietContext);

interface DietProviderProps {
  children: ReactNode;
}

export const DietProvider: React.FC<DietProviderProps> = ({ children }) => {
  const [dietaryRecords, setDietaryRecords] = useState<any[]>([]);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  // const [calorieData, setCalorieData] = useState<any[]>([]); // 暂时注释
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  
  
  // const addDietaryRecord = useCallback(async (record: any) => {
  //   try {
  //     setIsLoading(true);
  //     const userId = localStorage.getItem('userId') || 'current';
      
     
  //     const recordWithUserId = {
  //       ...record,
  //       userId
  //     };
      
  //     const response = await createDietaryRecord(recordWithUserId);
      
  //     if (response.code === 200) {
  //       message.success('Dietary record saved successfully!');
  //       // 更新本地记录
  //       setDietaryRecords(prev => [response.data, ...prev]);
  //     } else {
  //       throw new Error(response.message || 'Failed to save dietary record');
  //     }
  //   } catch (error: any) {
  //     console.error('Error adding dietary record:', error);
  //     message.error(error.message || 'Failed to save dietary record');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);
  
 
  const fetchDietaryRecords = useCallback(async () => {
   
    if (dietaryRecords.length > 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('userId') || 'current';
      
      const response = await getDietaryRecords();
      
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
  
  const fetchFoodItems = useCallback(async (recordId: number) => {
    const response = await getFoodItems(recordId);
    if (response.code === 200) {
      setFoodItems(response.data || []);
    }
  }, []);
  // const fetchCalorieData = useCallback(async (period: 'day' | 'week' | 'month' = 'week') => {
  //   if (calorieData.length > 0) {
  //     return;
  //   }
  //   try {
  //     setIsLoading(true);
  //     const userId = localStorage.getItem('userId') || 'current';
  //     
  //     const response = await getCalorieComparisonData(userId, period);
  //     
  //     if (response.code === 200) {
  //       setCalorieData(response.data || []);
  //     } else {
  //       throw new Error(response.message || 'Failed to fetch calorie data');
  //     }
  //   } catch (error: any) {
  //     console.error('Error fetching calorie data:', error);
  //     
  //     setCalorieData([]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [calorieData.length]);
  
  
  // const fetchDietarySuggestions = useCallback(async () => {
  
  //   if (suggestions !== null) {
  //     return;
  //   }
    
  //   try {
  //     setIsLoading(true);
  //     // const userId = localStorage.getItem('userId') || 'current';
      
  //     const response = await getDietarySuggestions('current');
      
  //     if (response.code === 200) {
  //       setSuggestions(response.data || null);
  //     } else {
  //       throw new Error(response.message || 'Failed to fetch dietary suggestions');
  //     }
  //   } catch (error: any) {
  //     console.error('Error fetching dietary suggestions:', error);
      
  //     setSuggestions(null);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [suggestions]);
  
 
  useEffect(() => {
    if (isAuthenticated && !dataFetched) {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
        
          await fetchDietaryRecords();
          // 再批量加载所有 foodItems
          // 假设 dietaryRecords 已经被 setDietaryRecords 更新
          // 需要用最新的 dietaryRecords
          const records = await getDietaryRecords();
          if (records.code === 200 && Array.isArray(records.data)) {
            for (const record of records.data) {
              if (typeof record.id === 'number') {
                await fetchFoodItems(record.id);
              }
            }
          }
          setDataFetched(true);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadInitialData();
    } else if (!isAuthenticated) {
     
      setDietaryRecords([]);
      // setCalorieData([]); // 暂时注释
      // setSuggestions(null);
      setDataFetched(false);
    }
  }, [isAuthenticated, dataFetched, fetchDietaryRecords, /*fetchCalorieData,*/ /*fetchDietarySuggestions*/]);
 
  const contextValue = React.useMemo(() => ({
    dietaryRecords,
    foodItems,
    // calorieData, // 暂时注释
    // suggestions,
    isLoading,
    // addDietaryRecord,
    fetchDietaryRecords,
    fetchFoodItems,
    // fetchCalorieData, // 暂时注释
    // fetchDietarySuggestions
  }), [
    dietaryRecords,
    foodItems,
    // calorieData, // 暂时注释
    // suggestions,
    isLoading,
    // addDietaryRecord,
    fetchDietaryRecords,
    fetchFoodItems,
    // fetchCalorieData, // 暂时注释
    // fetchDietarySuggestions
  ]);
  
  return (
    <DietContext.Provider value={{ ...contextValue }}>
      {children}
    </DietContext.Provider>
  );
};