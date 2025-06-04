import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserData {
  name: string;
  community: 'Santuário' | 'Lourdes' | 'São Vicente' | null;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  isRegistered: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      setUserDataState(JSON.parse(savedUserData));
    }
  }, []);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
    localStorage.setItem('userData', JSON.stringify(data));
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        isRegistered: !!userData
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 