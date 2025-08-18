import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@apollo/client';
import { useNavigation, useRoute } from '@react-navigation/native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import getCategoryColor from '../constants/getCategoryColor';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const getCategoryIcon = (type, category) => {
  if (type.toLowerCase() === 'income') {
    return { name: 'rupee-sign', color: '#fff', Icon: FontAwesome5 };
  }
  switch (category) {
    case 'Food & Drinks':
      return { name: 'fastfood', color: '#fff', Icon: MaterialIcons };
    case 'Travel':
      return { name: 'car', color: '#fff', Icon: FontAwesome5 };
    case 'Entertainment':
      return { name: 'theater-masks', color: '#fff', Icon: FontAwesome5 };
    case 'Loan EMIs':
      return { name: 'money-bill', color: '#fff', Icon: FontAwesome5 };
    case 'Rent':
      return { name: 'home', color: '#fff', Icon: FontAwesome5 };
    case 'Bills':
      return { name: 'file-invoice', color: '#fff', Icon: FontAwesome5 };
    case 'Health Care':
      return { name: 'heartbeat', color: '#fff', Icon: FontAwesome5 };
    case 'Shopping':
      return { name: 'shopping-bag', color: '#fff', Icon: FontAwesome5 };
    case 'Vacation':
      return { name: 'umbrella-beach', color: '#fff', Icon: FontAwesome5 };
    case 'Subscriptions':
      return { name: 'notifications', color: '#fff', Icon: MaterialIcons };
    default:
      return { name: 'th-large', color: '#fff', Icon: FontAwesome5 };
  }
};

const WalletTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { wallet: walletName } = route.params;

  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  const transactions = data?.transactions || [];

  // 🔍 Filter by wallet name
  const filteredTransactions = transactions.filter(
    tx => tx.wallet === walletName,
  );

  console.log('Selected walletName:', walletName);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.text}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.text}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerConatiner}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={25} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headingText}>{walletName}Wallet</Text>
      </View>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => {
          const { name, color, Icon } = getCategoryIcon(
            item.type,
            item.category,
          );

          return (
            <TouchableOpacity
              style={{
                backgroundColor: '#1f2937',
                marginBottom: 12,
                borderRadius: 12,
                padding: 12,
                elevation: 4,
              }}
              onPress={() => {
                navigation.navigate('TransactionDetails', {
                  transactions: item,
                });
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View
                    style={{
                      backgroundColor: getCategoryColor(
                        item.type,
                        item.category,
                      ),
                      padding: 10,
                      borderRadius: 10,
                      width: 45,
                      height: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name={name} size={20} color={color} />
                  </View>

                  <View>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: moderateScale(13),
                        fontWeight: '600',
                      }}
                    >
                      {item.type === 'income'
                        ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                        : item.category}
                    </Text>
                    <Text style={{ color: '#aaa', fontSize: 13 }}>
                      Wallet:{' '}
                      {item.wallet.charAt(0).toUpperCase() +
                        item.wallet.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      color: item.type === 'income' ? '#22c55e' : '#ef4444',
                      fontSize: moderateScale(13),
                      fontWeight: '600',
                    }}
                  >
                    {item.type === 'income' ? '+' : '-'}₹{item.amount}
                  </Text>
                  <Text style={{ color: '#ccc', fontSize: moderateScale(10) }}>
                    {item.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default WalletTransactionScreen;

const styles = StyleSheet.create({
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  headingText: {
    fontSize: moderateScale(16),
    color: '#fff',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#1f2937',
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
    marginRight: scale(10),
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: moderateScale(15),
  },
  headerText: {
    fontSize: moderateScale(15),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: verticalScale(12),
  },
  text: {
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    padding: moderateScale(8),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(8),
  },
});
