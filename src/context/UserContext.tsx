import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { UserProfileData } from '../components/UserProfileForm';
import { getUserProfile, saveUserProfile, updateUserProfile } from '../services/userAPI';

interface UserContextType {
  userProfile: UserProfileData | null;
  isProfileComplete: boolean;
  isLoading: boolean;
  error: string | null;
  updateUserProfile: (data: UserProfileData) => Promise<void>;
  hasShownForm: boolean;
  setHasShownForm: (value: boolean) => void;
}

const defaultContext: UserContextType = {
  userProfile: null,
  isProfileComplete: false,
  isLoading: false,
  error: null,
  updateUserProfile: async () => {},
  hasShownForm: false,
  setHasShownForm: () => {}
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
  const [hasShownForm, setHasShownForm] = useState<boolean>(false);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get user profile directly
      const response = await getUserProfile();
      if (response.code === 200 && response.data) {
        setUserProfile(response.data);
        if (response.data.userId) {
          localStorage.setItem('userId', String(response.data.userId));
        }
        // If we successfully get the profile, mark form as shown
        setHasShownForm(true);
      } else {
        // If no profile data, mark form as not shown yet
        setHasShownForm(false);
        setUserProfile(null);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError('Failed to fetch user profile');
      // On error, assume no profile exists
      setHasShownForm(false);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: UserProfileData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      if (userProfile) {
        // If profile exists, use PUT to update
        response = await updateUserProfile(data);
      } else {
        // If no profile exists, use POST to create
        response = await saveUserProfile(data);
      }
      
      if (response.code === 200) {
        setUserProfile(data);
        if (data.userId) {
          localStorage.setItem('userId', String(data.userId));
        }
        // After successful update, mark form as shown
        setHasShownForm(true);
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
        updateUserProfile: handleUpdateProfile,
        hasShownForm,
        setHasShownForm
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 