import React, { useCallback } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
import getCategoryColor from '../constants/getCategoryColor';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRefetch } from '../constants/RefetchContext';
import { useTheme } from '../constants/ThemeContext';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { getCategoryIcon } from '../constants/getCategoryIcon';

const TransactionsList = () => {
  const { theme } = useTheme();
  const { loading, error, data, refetch, networkStatus } = useQuery(
    GET_TRANSACTIONS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    },
  );

  const navigation = useNavigation();

  const { shouldRefetch, setShouldRefetch } = useRefetch();

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch) {
        refetch();
        setShouldRefetch(false);
      }
    }, [shouldRefetch]),
  );

  if (loading && networkStatus !== 4) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <Text style={{ color: 'red', padding: moderateScale(16) }}>
        Error: {error.message}
      </Text>
    );
  }

  const transactions = [...(data?.transactions ?? [])].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: '#aaa' }}>No transactions found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: moderateScale(16) }}
      renderItem={({ item }) => {
        const { name, color, Icon } = getCategoryIcon(item.type, item.category);

        return (
          <TouchableOpacity
            style={[
              styles.transactionRow,
              { backgroundColor: theme.transactionRowbg },
            ]}
            onPress={() => {
              navigation.navigate('TransactionDetails', { transactions: item });
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', gap: moderateScale(10) }}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: getCategoryColor(
                        item.type,
                        item.category,
                      ),
                    },
                  ]}
                >
                  <Icon name={name} size={moderateScale(14)} color={color} />
                </View>

                <View>
                  <Text style={[styles.TransactionText, { color: theme.text }]}>
                    {item.type === 'income'
                      ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                      : item.category}
                  </Text>
                  <Text style={{ color: '#aaa', fontSize: moderateScale(10) }}>
                    Wallet:{' '}
                    {item.wallet.charAt(0).toUpperCase() + item.wallet.slice(1)}
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    styles.amountText,
                    {
                      color: item.type === 'income' ? '#22c55e' : '#ef4444',
                    },
                  ]}
                >
                  {item.type === 'income' ? '+' : '-'}₹{item.amount}
                </Text>
                <Text style={styles.DateText}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default TransactionsList;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: moderateScale(16),
    alignItems: 'center',
  },
  transactionRow: {
    borderRadius: moderateScale(10),
    padding: moderateScale(8),
    marginVertical: verticalScale(4),
    elevation: 5,
  },
  TransactionText: {
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
  DateText: {
    color: '#9ca3af',
    fontSize: moderateScale(10),
  },
  iconContainer: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    width: scale(31),
    height: scale(31),
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
});
