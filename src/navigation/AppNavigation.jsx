// import { StatusBar, Alert, BackHandler } from 'react-native';
// import React, { useContext, useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import SplashScreen from '../screens/SplashScreen';
// import AuthStack from './AuthStack';
// import MainStack from './MainStack';
// import { AuthContext } from './AuthContext';
// import { useTheme } from '../constants/ThemeContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NativeModules } from 'react-native';

// const { BiometricModule } = NativeModules;

// const MemoizedAuthStack = React.memo(AuthStack);
// const MemoizedMainStack = React.memo(MainStack);

// const AppNavigation = () => {
//   const { theme } = useTheme();

//   const [isLoading, setloading] = useState(true);
//   const { isAuthenticated } = useContext(AuthContext);

//   const [biometricChecked, setBiometricChecked] = useState(false);

//   useEffect(() => {
//     const time = setTimeout(() => {
//       setloading(false);
//     }, 2000);

//     return () => clearTimeout(time);
//   }, []);

//     useEffect(() => {
//     const checkBiometric = async () => {
//       try {
//         const enabled = await AsyncStorage.getItem('biometricEnabled');

//         if (enabled === 'true') {
//           // ✅ If lock enabled → authenticate first
//           const success = await BiometricModule.authenticate();
//           if (!success) {
//             Alert.alert("Authentication Failed", "Closing App...");
//             BackHandler.exitApp(); // exit app if fail
//             return;
//           }
//         }
//       } catch (error) {
//         console.log("Biometric check error:", error);
//       } finally {
//         setBiometricChecked(true);
//         setLoading(false);
//       }
//     };

//     checkBiometric();
//   }, []);

//   if (isLoading) {
//     return <SplashScreen />;
//   }

//   return (
//     <NavigationContainer theme={theme.navigationTheme}>
//       <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bgColor} />

//       {isAuthenticated ? <MemoizedMainStack /> : <MemoizedAuthStack />}
//     </NavigationContainer>
//   );
// };

// export default AppNavigation;
import { StatusBar, AppState } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { AuthContext } from './AuthContext';
import { useTheme } from '../constants/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BiometricScreen from '../screens/BiometricScreen';

const MemoizedAuthStack = React.memo(AuthStack);
const MemoizedMainStack = React.memo(MainStack);

const AppNavigation = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useContext(AuthContext);

  const [showSplash, setShowSplash] = useState(true); // splash ke liye
  const [requireBiometric, setRequireBiometric] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const appState = useRef(AppState.currentState);

  // ✅ Cold start
  useEffect(() => {
    const initApp = async () => {
      const enabled = await AsyncStorage.getItem('biometricEnabled');

      if (enabled === 'true') {
        setRequireBiometric(true);
        setAuthenticated(false);
      } else {
        setAuthenticated(true); // no biometric
      }

      // 2 sec ke liye splash screen dikhana
      setTimeout(() => {
        setShowSplash(false);
      }, 2000);
    };

    initApp();
  }, []);

  // ✅ Resume case
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          const enabled = await AsyncStorage.getItem('biometricEnabled');
          if (enabled === 'true') {
            setRequireBiometric(true);
            setAuthenticated(false); // lock again
          }
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  // ✅ Step 1: Agar splash show karna hai
  if (showSplash) return <SplashScreen />;

  // ✅ Step 2: Agar biometric required hai aur abhi authenticate nahi hua
  if (requireBiometric && !authenticated) {
    return <BiometricScreen onSuccess={() => setAuthenticated(true)} />;
  }

  // ✅ Step 3: Normal navigation
  return (
    <NavigationContainer theme={theme.navigationTheme}>
      <StatusBar barStyle={theme.barStyle} backgroundColor={theme.bgColor} />
      {isAuthenticated ? <MemoizedMainStack /> : <MemoizedAuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;
