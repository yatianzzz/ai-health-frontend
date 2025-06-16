import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfileData } from '../components/UserProfileForm';
import { getUserProfile, saveUserProfile } from '../services/userAPI';

interface UserContextType {
  userProfile: UserProfileData | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserProfile: (data: UserProfileData) => Promise<void>;
}

const defaultContext: UserContextType = {
  userProfile: null,
  isProfileComplete: false,
  isLoading: false,
  error: null,
  updateUserProfile: async () => {}
};

const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getUserProfile();
      if (response.code === 200 && response.data) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: UserProfileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await saveUserProfile(data);
      if (response.code === 200) {
        setUserProfile(data);
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Failed to update user profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isProfileComplete: !!userProfile,
        isLoading,
        error,
        updateUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 