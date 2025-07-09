import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getWeeklySummary } from '../services/exerciseAPI';
import { useAuth } from './AuthContext';


interface ExerciseContextType {
  totalSteps: number;
  totalCalories: number;
  totalDuration: number;
  stepsCompletion: number;
  caloriesCompletion: number;
  durationCompletion: number;
  refreshExerciseData: () => Promise<void>;
  isLoading: boolean;
}


const defaultContext: ExerciseContextType = {
  totalSteps: 0,
  totalCalories: 0,
  totalDuration: 0,
  stepsCompletion: 0,
  caloriesCompletion: 0,
  durationCompletion: 0,
  refreshExerciseData: async () => {},
  isLoading: false
};


const ExerciseContext = createContext<ExerciseContextType>(defaultContext);


interface ExerciseProviderProps {
  children: ReactNode;
}


const WEEKLY_STEPS_GOAL = 70000;
const WEEKLY_CALORIES_GOAL = 3500;
const WEEKLY_DURATION_GOAL = 150;


export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ children }) => {
  const [totalSteps, setTotalSteps] = useState<number>(0);
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [stepsCompletion, setStepsCompletion] = useState<number>(0);
  const [caloriesCompletion, setCaloriesCompletion] = useState<number>(0);
  const [durationCompletion, setDurationCompletion] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  const refreshExerciseData = async () => {
    // 只有在用户已认证时才获取数据
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping exercise data refresh');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getWeeklySummary();

      if (response.code === 200 && response.data) {
        const { totalSteps, totalCalories, totalDuration } = response.data;


        setTotalSteps(totalSteps);
        setTotalCalories(totalCalories);
        setTotalDuration(totalDuration);


        setStepsCompletion(Math.min(100, (totalSteps / WEEKLY_STEPS_GOAL) * 100));
        setCaloriesCompletion(Math.min(100, (totalCalories / WEEKLY_CALORIES_GOAL) * 100));
        setDurationCompletion(Math.min(100, (totalDuration / WEEKLY_DURATION_GOAL) * 100));
      }
    } catch (error) {
      console.error('Failed to refresh exercise data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    // 只有在用户已认证时才刷新数据
    if (isAuthenticated) {
      refreshExerciseData();
    }
  }, [isAuthenticated]);

  return (
    <ExerciseContext.Provider
      value={{
        totalSteps,
        totalCalories,
        totalDuration,
        stepsCompletion,
        caloriesCompletion,
        durationCompletion,
        refreshExerciseData,
        isLoading
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};

// Custom hook for using the exercise context
export const useExercise = () => useContext(ExerciseContext); 