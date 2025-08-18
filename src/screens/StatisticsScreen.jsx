import { LineChart } from 'react-native-chart-kit';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
import moment from 'moment';

import Transactions from '../components/TransactionsList';

import { useTheme } from '../constants/ThemeContext';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const StatisticsScreen = () => {
  const { theme } = useTheme();
  const { data, loading, error } = useQuery(GET_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('Weekly');
  const tabs = ['Weekly', 'Monthly', 'Yearly'];

  const transactions = data?.transactions ?? [];

  const filteredTransactions = useMemo(() => {
    const now = moment();
    if (activeTab === 'Weekly') {
      return transactions.filter(t => moment(t.date).isSame(now, 'week'));
    } else if (activeTab === 'Monthly') {
      return transactions.filter(t => moment(t.date).isSame(now, 'month'));
    } else if (activeTab === 'Yearly') {
      return transactions.filter(t => moment(t.date).isSame(now, 'year'));
    }
    return transactions;
  }, [transactions, activeTab]);

  const chartData = useMemo(() => {
    let grouped = {};
    let labels = [];
    let values = [];

    if (activeTab === 'Weekly') {
      const weekStart = moment().startOf('week'); // Sunday
      const labelsOrder = [];

      // Sunday to Saturday (7 days)
      for (let i = 0; i < 7; i++) {
        const day = weekStart.clone().add(i, 'days').format('ddd');
        labelsOrder.push(day);
        grouped[day] = 0;
      }

      labels.push(...labelsOrder); // maintain correct order

      filteredTransactions.forEach(t => {
        const day = moment(t.date).format('ddd');
        if (grouped[day] !== undefined) {
          grouped[day] += t.amount;
        }
      });
    } else if (activeTab === 'Monthly') {
      const startOfMonth = moment().startOf('month');
      const endOfMonth = moment().endOf('month');

      // Move to the Sunday before or equal to the 1st of the month
      let currentWeekStart = startOfMonth.clone().startOf('week'); // Sunday
      let weekCount = 1;

      // Prepare grouped data
      while (currentWeekStart.isBefore(endOfMonth)) {
        const label = `Week ${weekCount}`;
        labels.push(label);
        grouped[label] = 0;

        currentWeekStart.add(1, 'week');
        weekCount++;
      }

      // Group each transaction
      filteredTransactions.forEach(t => {
        const txDate = moment(t.date);

        let weekStart = startOfMonth.clone().startOf('week'); // Sunday
        let labelIndex = 1;

        while (weekStart.isBefore(endOfMonth)) {
          const weekEnd = weekStart.clone().endOf('week');

          if (txDate.isBetween(weekStart, weekEnd, 'day', '[]')) {
            const label = `Week ${labelIndex}`;
            grouped[label] += t.amount;
            break;
          }

          weekStart.add(1, 'week');
          labelIndex++;
        }
      });
    } else if (activeTab === 'Yearly') {
      for (let i = 0; i < 12; i++) {
        const month = moment().month(i).format('MMM');
        labels.push(month);
        grouped[month] = 0;
      }
      filteredTransactions.forEach(t => {
        const month = moment(t.date).format('MMM');
        grouped[month] += t.amount;
      });
    }

    values = labels.map(label => grouped[label]);
    return { labels, datasets: [{ data: values }] };
  }, [filteredTransactions, activeTab]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bgColor }]}
    >
      <Text style={[styles.header, { color: theme.statisticsText }]}>
        Statistics
      </Text>

      <View>
        <LineChart
          data={chartData}
          width={screenWidth - 25}
          height={moderateScale(180)}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: moderateScale(8),
            borderRadius: moderateScale(10),
            alignSelf: 'center',
          }}
        />
      </View>

      {/* Tabs */}
      <View
        style={[styles.tabContainer, { backgroundColor: theme.tabContainer }]}
      >
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && { backgroundColor: theme.activeTab },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.tabText },
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      <Text style={[styles.subHeading, { color: theme.statisticsText }]}>
        Transactions
      </Text>
      <Transactions />
    </SafeAreaView>
  );
};

export default React.memo(StatisticsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginLeft: scale(12),
  },

  tabContainer: {
    flexDirection: 'row',
    borderRadius: moderateScale(12),
    padding: moderateScale(4),
    justifyContent: 'space-between',
    marginBottom: verticalScale(5),
    marginHorizontal: scale(13),
  },
  tabButton: {
    flex: 1,
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  tabText: {
    fontSize: moderateScale(10),
  },
  activeTabText: {
    fontWeight: '600',
  },
  subHeading: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginLeft: scale(13),
  },
});
