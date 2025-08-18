import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LogInScreen from '../screens/LogInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import NumberLogInScreen from '../screens/NumberLogInScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LogIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="LogIn" component={LogInScreen} />
      <Stack.Screen name="NumberLogIn" component={NumberLogInScreen} />
    </Stack.Navigator>
  );
};

export default React.memo(AuthStack);
