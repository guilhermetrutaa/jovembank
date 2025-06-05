import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  community: string;
}

interface UserContextType {
  isRegistered: boolean;
  userData: User | null;
  register: (name: string, community: string) => Promise<void>;
  loadUser: (name: string, community: string) => Promise<void>;
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
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserData(user);
    }
  }, []);

  const register = async (name: string, community: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, community }),
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      const user = await response.json();
      setUserData(user);
      localStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const loadUser = async (name: string, community: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${encodeURIComponent(name)}/${encodeURIComponent(community)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return;
        }
        throw new Error('Erro ao carregar usuário');
      }

      const data = await response.json();
      setUserData(data.user);
      localStorage.setItem('userData', JSON.stringify(data.user));
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        isRegistered: !!userData,
        userData,
        register,
        loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}; 