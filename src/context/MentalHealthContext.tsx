import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface MentalHealthData {
  comprehensiveEvaluation: 'Stable' | 'Unstable' | '--';
  stressIndex: number | '--';
  todaysMood: 'Very good' | 'Good' | 'Sad' | 'Depressed' | '--';
  lastAssessmentDate?: Date;
  lastStressAssessmentDate?: Date;
}

interface MentalHealthContextType {
  mentalHealthData: MentalHealthData;
  updateComprehensiveEvaluation: (result: 'Stable' | 'Unstable') => void;
  updateStressIndex: (score: number) => void;
  resetData: () => void;
}

const defaultMentalHealthData: MentalHealthData = {
  comprehensiveEvaluation: '--',
  stressIndex: '--',
  todaysMood: '--'
};

const MentalHealthContext = createContext<MentalHealthContextType | undefined>(undefined);

export const useMentalHealth = () => {
  const context = useContext(MentalHealthContext);
  if (!context) {
    throw new Error('useMentalHealth must be used within a MentalHealthProvider');
  }
  return context;
};

interface MentalHealthProviderProps {
  children: ReactNode;
}

export const MentalHealthProvider: React.FC<MentalHealthProviderProps> = ({ children }) => {
  const [mentalHealthData, setMentalHealthData] = useState<MentalHealthData>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('mentalHealthData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultMentalHealthData,
          ...parsed,
          lastAssessmentDate: parsed.lastAssessmentDate ? new Date(parsed.lastAssessmentDate) : undefined,
          lastStressAssessmentDate: parsed.lastStressAssessmentDate ? new Date(parsed.lastStressAssessmentDate) : undefined
        };
      } catch (error) {
        console.error('Error parsing saved mental health data:', error);
      }
    }
    return defaultMentalHealthData;
  });

  // Calculate Today's Mood based on Stress Index
  const calculateMood = (stressScore: number | '--'): 'Very good' | 'Good' | 'Sad' | 'Depressed' | '--' => {
    if (stressScore === '--') return '--';
    
    if (stressScore > 80) return 'Very good';
    if (stressScore >= 60) return 'Good';
    if (stressScore >= 40) return 'Sad';
    return 'Depressed';
  };

  const updateComprehensiveEvaluation = (result: 'Stable' | 'Unstable') => {
    setMentalHealthData(prev => ({
      ...prev,
      comprehensiveEvaluation: result,
      lastAssessmentDate: new Date()
    }));
  };

  const updateStressIndex = (score: number) => {
    const mood = calculateMood(score);
    setMentalHealthData(prev => ({
      ...prev,
      stressIndex: score,
      todaysMood: mood,
      lastStressAssessmentDate: new Date()
    }));
  };

  const resetData = () => {
    setMentalHealthData(defaultMentalHealthData);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('mentalHealthData', JSON.stringify(mentalHealthData));
  }, [mentalHealthData]);

  const value: MentalHealthContextType = {
    mentalHealthData,
    updateComprehensiveEvaluation,
    updateStressIndex,
    resetData
  };

  return (
    <MentalHealthContext.Provider value={value}>
      {children}
    </MentalHealthContext.Provider>
  );
};
