import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

import auth from '@react-native-firebase/auth';

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const login = () => setIsAuthenticated(true);

  const logout = async () => {
    await auth().signOut();
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {!initializing && children}
    </AuthContext.Provider>
  );
};
