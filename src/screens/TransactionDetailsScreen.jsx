import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import { WalletContext } from '../constants/WalletContext';
import { useNavigation, useRoute } from '@react-navigation/native';

import { expenseCategories } from '../constants/ExpenseCategories';
import { useTheme } from '../constants/ThemeContext';

import { useMutation } from '@apollo/client';
import {
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
} from '../graphql/mutations/mutations';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';

const TransactionDetailsScreen = () => {
  const { theme } = useTheme();
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
    awaitRefetchQueries: true,
  });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: [GET_TRANSACTIONS],
    awaitRefetchQueries: true,
  });

  const route = useRoute();
  const { transactions } = route.params;
  const navigation = useNavigation();

  const { wallets } = useContext(WalletContext);

  const [selectedType, setSelectedType] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current && transactions) {
      setSelectedType(transactions.type);
      setSelectedWallet(transactions.wallet);
      setSelectedCategory(transactions.category || '');
      setAmount(transactions.amount.toString());
      setDescription(transactions.description || '');
      isMounted.current = true;
    }
  }, []);

  const typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const handleUpdate = async () => {
    if (!amount || !selectedType || !selectedWallet) {
      Alert.alert('Error', 'Please fill in all the required fields.');
      return;
    }

    try {
      setIsLoading(true); // Start spinner

      await updateTransaction({
        variables: {
          id: transactions.id,
          type: selectedType,
          wallet: selectedWallet,
          amount: parseFloat(amount),
          category: selectedType === 'expense' ? selectedCategory : '',
          description,
        },
      });

      // Wait for 0.5 seconds before showing success animation
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage('Transaction Updated!');
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          navigation.goBack();
        }, 1500);
      }, 500); // <-- 0.5 second loading delay
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction({ variables: { id: transactions.id } });
              setShowSuccess(true);
              setSuccessMessage('Transaction deleted!');
              setTimeout(() => {
                setShowSuccess(false);
                navigation.goBack();
              }, 1500);
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete');
            }
          },
        },
      ],
    );
  };

  if (showSuccess) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#111827',
        }}
      >
        <LottieView
          source={require('../animation/success.json')}
          autoPlay
          loop={false}
          style={{ width: moderateScale(150), height: moderateScale(150) }}
        />
        <Text style={{ color: '#fff', marginTop: 20, fontSize: 16 }}>
          {successMessage}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bgColor }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerConatiner}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.backButton }]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons
                name="chevron-back"
                size={moderateScale(20)}
                color="#fff"
              />
            </TouchableOpacity>

            <Text style={[styles.headingText, { color: theme.text }]}>
              {selectedType === 'income' ? 'Income' : 'Expense'} Details
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Type</Text>
          <Dropdown
            data={typeOptions}
            labelField="label"
            valueField="value"
            value={selectedType}
            onChange={item => setSelectedType(item.value)}
            style={[styles.dropdown, { backgroundColor: theme.inputBg }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={{ color: theme.text }}
            containerStyle={{ backgroundColor: theme.dropdownBg }}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#888" />
            )}
            renderItem={(item, selected) => (
              <View
                style={{
                  backgroundColor: selected
                    ? theme.dropdownSelected
                    : theme.dropdownBg,
                  padding: moderateScale(10),
                }}
              >
                <Text style={{ color: '#fff' }}>{item.label}</Text>
              </View>
            )}
          />

          <Text style={[styles.label, { color: theme.text }]}>Wallet</Text>
          <Dropdown
            data={wallets}
            labelField="label"
            valueField="value"
            value={selectedWallet}
            onChange={item => setSelectedWallet(item.value)}
            style={[styles.dropdown, { backgroundColor: theme.inputBg }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={{ color: theme.text }}
            containerStyle={{ backgroundColor: theme.dropdownBg }}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#888" />
            )}
            renderItem={(item, selected) => (
              <View
                style={{
                  backgroundColor: selected
                    ? theme.dropdownSelected
                    : theme.dropdownBg,
                  padding: moderateScale(10),
                }}
              >
                <Text style={{ color: '#fff' }}>{item.label}</Text>
              </View>
            )}
          />

          {selectedType === 'expense' && (
            <>
              <Text style={[styles.label, { color: theme.text }]}>
                Expense Category
              </Text>
              <Dropdown
                data={expenseCategories}
                labelField="label"
                valueField="value"
                value={selectedCategory}
                onChange={item => setSelectedCategory(item.value)}
                style={[styles.dropdown, { backgroundColor: theme.inputBg }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={{ color: theme.text }}
                containerStyle={{ backgroundColor: theme.dropdownBg }}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#888" />
                )}
                renderItem={(item, selected) => (
                  <View
                    style={{
                      backgroundColor: selected
                        ? theme.dropdownSelected
                        : theme.dropdownBg,
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: '#fff' }}>{item.label}</Text>
                  </View>
                )}
              />
            </>
          )}

          <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.inputBg, color: theme.text },
            ]}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#888"
          />

          <Text style={[styles.label, { color: theme.text }]}>
            Description (optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                height: verticalScale(100),
                textAlignVertical: 'top',
                backgroundColor: theme.inputBg,
                color: theme.text,
              },
            ]}
            multiline
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
            placeholderTextColor="#888"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Update</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.DeleteBtn}>
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default React.memo(TransactionDetailsScreen);

const styles = {
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(60),
    marginBottom: verticalScale(20),
  },
  headingText: {
    fontSize: moderateScale(20),
    color: '#fff',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#1f2937',
    borderRadius: moderateScale(10),
    padding: moderateScale(8),
    marginRight: scale(10),
    alignItems: 'center',
  },
  label: {
    color: '#ccc',
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
    fontSize: moderateScale(14),
  },
  dropdown: {
    backgroundColor: '#1f2937',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  placeholderStyle: {
    color: '#888',
    fontSize: moderateScale(14),
  },
  selectedTextStyle: {
    color: '#fff',
    fontSize: moderateScale(14),
  },
  input: {
    backgroundColor: '#1f2937',
    height: verticalScale(60),
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    color: '#fff',
    marginBottom: verticalScale(16),
    fontSize: moderateScale(14),
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    width: '74%',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  DeleteBtn: {
    backgroundColor: '#f12222ff',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    width: '24%',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
};
