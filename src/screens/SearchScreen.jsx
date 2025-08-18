import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
import { from, useQuery } from '@apollo/client';
import { getCategoryIcon } from '../constants/getCategoryIcon';
import getCategoryColor from '../constants/getCategoryColor';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const { data } = useQuery(GET_TRANSACTIONS, {
    fetchPolicy: 'cache-and-network',
  });

  const transactions = data?.transactions;

  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    if (!transactions) return [];
    if (!searchText.trim()) return transactions;

    const lowerSearch = searchText.toLowerCase();
    return transactions.filter(
      tx =>
        tx.category?.toLowerCase().includes(lowerSearch) ||
        tx.wallet?.toLowerCase().includes(lowerSearch) ||
        tx.type?.toLowerCase().includes(lowerSearch),
    );
  }, [searchText, transactions]);

  const renderItem = useCallback(
    ({ item }) => {
      const { name, color, Icon } = getCategoryIcon(item.type, item.category);

      return (
        <TouchableOpacity
          style={[
            styles.transaction,

            { backgroundColor: theme.transactionRowbg },
          ]}
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
            <View style={{ flexDirection: 'row', gap: scale(12) }}>
              <View
                style={{
                  backgroundColor: getCategoryColor(item.type, item.category),
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
                <Text style={[styles.TransactionName, { color: theme.text }]}>
                  {item.type === 'income'
                    ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
                    : item.category}
                </Text>
                <Text style={{ color: '#aaa', fontSize: 13 }}>
                  Wallet:{' '}
                  {item.wallet.charAt(0).toUpperCase() + item.wallet.slice(1)}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text
                style={{
                  color: item.type === 'income' ? '#22c55e' : '#ef4444',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {item.type === 'income' ? '+' : '-'}₹{item.amount}
              </Text>
              <Text style={{ color: '#ccc', fontSize: 12 }}>{item.date}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation, theme],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={moderateScale(20)}
          color={'#aaa'}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by category, wallet, or type"
          style={[styles.inputText, { color: theme.text }]}
          placeholderTextColor={'#aaa'}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Text style={{ color: theme.text }}>No transactions found</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default React.memo(SearchScreen);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderRadius: moderateScale(60),
    marginTop: verticalScale(10),
    marginHorizontal: scale(10),
    padding: moderateScale(4),
    gap: scale(8),
    borderWidth: 1,
    borderColor: '#525252',
    marginBottom: verticalScale(5),
  },
  searchIcon: {
    marginLeft: scale(8),
  },
  inputText: {
    flex: 1,
  },
  transaction: {
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(12),
    padding: moderateScale(10),
    elevation: 4,
  },
  TransactionName: {
    fontSize: moderateScale(12),
    fontWeight: '400',
  },
});
