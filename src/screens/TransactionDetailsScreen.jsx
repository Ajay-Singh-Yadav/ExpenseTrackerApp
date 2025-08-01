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

import { WalletContext } from '../constants/WalletContext';
import { useNavigation, useRoute } from '@react-navigation/native';

import { expenseCategories } from '../constants/ExpenseCategories';

import { useMutation } from '@apollo/client';
import {
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
} from '../graphql/mutations/mutations';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';

const TransactionDetailsScreen = () => {
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
  }, [transactions]);

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
          style={{ width: 200, height: 200 }}
        />
        <Text style={{ color: '#fff', marginTop: 20, fontSize: 16 }}>
          {successMessage}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#111827' }}>
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
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back" size={25} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headingText}>
              {selectedType === 'income' ? 'Income' : 'Expense'} Details
            </Text>
          </View>

          <Text style={styles.label}>Type</Text>
          <Dropdown
            data={typeOptions}
            labelField="label"
            valueField="value"
            value={selectedType}
            onChange={item => setSelectedType(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{ backgroundColor: '#1f2937' }}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#888" />
            )}
            renderItem={(item, selected) => (
              <View
                style={{
                  backgroundColor: selected ? '#374151' : '#1f2937',
                  padding: 12,
                }}
              >
                <Text style={{ color: '#fff' }}>{item.label}</Text>
              </View>
            )}
          />

          <Text style={styles.label}>Wallet</Text>
          <Dropdown
            data={wallets}
            labelField="label"
            valueField="value"
            value={selectedWallet}
            onChange={item => setSelectedWallet(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={{ backgroundColor: '#1f2937' }}
            renderRightIcon={() => (
              <Ionicons name="chevron-down" size={20} color="#888" />
            )}
            renderItem={(item, selected) => (
              <View
                style={{
                  backgroundColor: selected ? '#374151' : '#1f2937',
                  padding: 12,
                }}
              >
                <Text style={{ color: '#fff' }}>{item.label}</Text>
              </View>
            )}
          />

          {selectedType === 'expense' && (
            <>
              <Text style={styles.label}>Expense Category</Text>
              <Dropdown
                data={expenseCategories}
                labelField="label"
                valueField="value"
                value={selectedCategory}
                onChange={item => setSelectedCategory(item.value)}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={{ backgroundColor: '#1f2937' }}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#888" />
                )}
                renderItem={(item, selected) => (
                  <View
                    style={{
                      backgroundColor: selected ? '#374151' : '#1f2937',
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: '#fff' }}>{item.label}</Text>
                  </View>
                )}
              />
            </>
          )}

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
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

const styles = {
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 90,
    marginBottom: 20,
  },
  headingText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  label: {
    color: '#ccc',
    marginTop: 12,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  placeholderStyle: {
    color: '#888',
  },
  selectedTextStyle: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#1f2937',
    height: 60,
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    width: 415,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  DeleteBtn: {
    backgroundColor: '#f12222ff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
};

export default TransactionDetailsScreen;
