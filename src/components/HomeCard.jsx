import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const HomeCard = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <ImageBackground
      source={require('../assets/images/card.png')}
      resizeMode="stretch"
      style={styles.constainer}
    >
      <Text style={styles.totalBalanceText}>Total Balance</Text>

      <Text style={styles.totalBalanceAmount}>
        ₹ {Number(totalBalance).toFixed(2)}
      </Text>

      <View style={styles.IncomeExpenseContainer}>
        <View style={styles.rowCenterText}>
          <View style={[styles.UpAndDownArrow, { backgroundColor: 'green' }]}>
            <Ionicons name="arrow-up" size={moderateScale(15)} color="white" />
          </View>
          <Text style={styles.IncomeText}>Income</Text>
        </View>

        <View style={styles.rowCenterText}>
          <View style={[styles.UpAndDownArrow, { backgroundColor: 'red' }]}>
            <Ionicons
              name="arrow-down"
              size={moderateScale(15)}
              color="white"
            />
          </View>
          <Text style={styles.ExpenseText}>Expense</Text>
        </View>
      </View>

      <View style={styles.rowcenater}>
        <View style={styles.IncomeAmountConatiner}>
          <MaterialCommunityIcons
            name="currency-inr"
            size={moderateScale(18)}
            color="green"
          />
          <Text style={styles.IncomeAmount}>{totalIncome}</Text>
        </View>
        <View style={styles.ExpenseAmountContainer}>
          <MaterialCommunityIcons
            name="currency-inr"
            size={moderateScale(18)}
            color="red"
          />
          <Text style={styles.ExpenseAmount}>{totalExpense}</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default React.memo(HomeCard);

const styles = StyleSheet.create({
  constainer: {
    width: scale(320),
    height: verticalScale(200),
  },
  totalBalanceText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginLeft: moderateScale(20),
    marginTop: verticalScale(20),
    color: '#3B3B3B',
  },
  totalBalanceAmount: {
    fontSize: moderateScale(25),
    fontWeight: '600',
    marginLeft: moderateScale(20),
  },
  rowCenterText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowcenater: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(18),
    marginTop: moderateScale(10),
  },
  UpAndDownArrow: {
    borderRadius: moderateScale(60),
    width: moderateScale(20),
    height: moderateScale(20),
    padding: moderateScale(3),
    marginRight: moderateScale(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  IncomeExpenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(20),
    alignItems: 'center',
    marginTop: verticalScale(25),
  },
  IncomeText: {
    fontSize: moderateScale(15),
    fontWeight: '400',
  },
  ExpenseText: {
    fontSize: moderateScale(15),
    fontWeight: '400',
  },

  IncomeAmount: {
    color: 'green',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  ExpenseAmount: {
    color: 'red',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  ExpenseAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: moderateScale(22),
  },
  IncomeAmountConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
