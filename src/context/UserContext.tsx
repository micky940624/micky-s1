import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '../utils/localStorage';

interface User {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone?: string;
  gstNumber?: string;
  businessAddress?: string;
  upiId?: string;
  isLoggedIn: boolean;
  subscription: {
    type: 'trial' | 'monthly' | 'yearly' | 'lifetime';
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  trialDaysLeft: number;
  isSpecialAccount?: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isTrialExpired: () => boolean;
  hasActiveSubscription: () => boolean;
  getTrialDaysLeft: () => number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = storage.getUser();
    if (userData) {
      // Update trial days left
      if (userData.subscription.type === 'trial') {
        userData.trialDaysLeft = getTrialDaysLeftForUser(userData);
      }
      setUser(userData);
    }
  }, []);

  const getTrialDaysLeftForUser = (userData: User) => {
    const trialEndDate = new Date(userData.subscription.startDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    return Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  };

  const login = (userData: User) => {
    if (userData.subscription.type === 'trial') {
      userData.trialDaysLeft = getTrialDaysLeftForUser(userData);
    }
    setUser(userData);
    storage.saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    storage.clearUserData();
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      
      // Update subscription type and reset trial
      if (updates.subscription) {
        updatedUser.subscription = { ...user.subscription, ...updates.subscription };
        if (updatedUser.subscription.type !== 'trial') {
          updatedUser.trialDaysLeft = 0;
        }
      }
      
      setUser(updatedUser);
      storage.saveUser(updatedUser);
    }
  };

  const isTrialExpired = () => {
    if (!user) return true;
    if (user.subscription.type !== 'trial') return false;
    
    const trialEndDate = new Date(user.subscription.startDate);
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    return new Date() > trialEndDate;
  };

  const hasActiveSubscription = () => {
    if (!user) return false;
    
    if (user.subscription.type === 'monthly' || user.subscription.type === 'yearly') {
      const endDate = new Date(user.subscription.endDate);
      return user.subscription.isActive && new Date() <= endDate;
    }
    
    return false;
  };

  const getTrialDaysLeft = () => {
    if (!user || user.subscription.type !== 'trial') return 0;
    return getTrialDaysLeftForUser(user);
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      login,
      logout,
      updateUser,
      isTrialExpired,
      hasActiveSubscription,
      getTrialDaysLeft
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};