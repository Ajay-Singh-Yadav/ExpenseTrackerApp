import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import TransactionDetailsScreen from '../screens/TransactionDetailsScreen';
import WalletTransactionScreen from '../screens/WalletTransactionScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen name="Add" component={AddTransactionScreen} />
      <Stack.Screen
        name="WalletTransactions"
        component={WalletTransactionScreen}
      />

      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          gestureDirection: 'vertical',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default React.memo(MainStack);
