import { StatusBar } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { AuthContext } from './AuthContext';
import { useTheme } from '../constants/ThemeContext';

const MemoizedAuthStack = React.memo(AuthStack);
const MemoizedMainStack = React.memo(MainStack);

const AppNavigation = () => {
  const { theme } = useTheme();

  const [isLoading, setloading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const time = setTimeout(() => {
      setloading(false);
    }, 2000);

    return () => clearTimeout(time);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer theme={theme.navigationTheme}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bgColor} />

      {isAuthenticated ? <MemoizedMainStack /> : <MemoizedAuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
