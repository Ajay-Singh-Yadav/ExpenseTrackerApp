import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations/mutations';

import { WalletContext } from '../constants/WalletContext';

import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useRefetch } from '../constants/RefetchContext';
import { expenseCategories } from '../constants/ExpenseCategories';
import { useTheme } from '../constants/ThemeContext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const AddTransactionScreen = () => {
  const { theme } = useTheme();
  const { wallets } = useContext(WalletContext);
  const { setShouldRefetch } = useRefetch();

  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [wallet, setWallet] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigation = useNavigation();

  const [addTransaction] = useMutation(ADD_TRANSACTION);

  const typeOptions = [
    { label: 'Income', value: 'income' },
    { label: 'Expense', value: 'expense' },
  ];

  const handleSave = async () => {
    try {
      if (!type || !wallet || !amount) {
        alert('Please fill in all required fields.');
        return;
      }

      setIsLoading(true);

      const amountFloat = parseFloat(amount);
      const date = new Date().toISOString().split('T')[0];

      const { data } = await addTransaction({
        variables: {
          type,
          wallet,
          amount: amountFloat,
          category,
          date,
          description,
        },
      });

      // Clear form
      setAmount('');
      setWallet('');
      setCategory('');
      setDescription('');
      setType('');

      // Delay to show spinner for 0.5s before success animation
      setTimeout(() => {
        setIsLoading(false); // Hide spinner
        setShowSuccess(true); // Show success animation

        setTimeout(() => {
          setShowSuccess(false);
          // Trigger refetch and go back
          setShouldRefetch(true);
          navigation.goBack();
        }, 1500); // Show success for 1.5s
      }, 500); // Wait 0.5s after mutation before showing success
    } catch (e) {
      console.error('❌ Error adding transaction:', e.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Wallets from context:', wallets);
  }, [wallets]);

  if (showSuccess) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.bgColor,
        }}
      >
        <LottieView
          source={require('../animation/success.json')}
          autoPlay
          loop={false}
          style={{ width: moderateScale(150), height: moderateScale(150) }}
        />
        <Text style={{ color: '#fff', marginTop: 20, fontSize: 16 }}>
          Transaction Added!
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
              Add Transaction
            </Text>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Type</Text>
          <Dropdown
            data={typeOptions}
            labelField="label"
            valueField="value"
            value={type}
            onChange={item => setType(item.value)}
            placeholder="Select type"
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
                <Text style={{ color: theme.text }}>{item.label}</Text>
              </View>
            )}
          />

          <Text style={[styles.label, { color: theme.text }]}>Wallet</Text>
          <Dropdown
            data={wallets}
            labelField="label"
            valueField="value"
            value={wallet}
            onChange={item => setWallet(item.value)}
            placeholder="Select wallet"
            style={[styles.dropdown, { backgroundColor: theme.inputBg }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={{ color: theme.text }}
            containerStyle={{ backgroundColor: theme.dropdownBg }}
            renderRightIcon={() => (
              <Ionicons
                name="chevron-down"
                size={moderateScale(15)}
                color="#888"
              />
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
                <Text style={{ color: theme.text }}>{item.label}</Text>
              </View>
            )}
          />

          {type === 'expense' && (
            <>
              <Text style={[styles.label, { color: theme.text }]}>
                Expense Category
              </Text>
              <Dropdown
                data={expenseCategories}
                labelField="label"
                valueField="value"
                value={category}
                onChange={item => setCategory(item.value)}
                placeholder="Select category"
                style={[styles.dropdown, { backgroundColor: theme.inputBg }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={{ color: theme.text }}
                containerStyle={{ backgroundColor: theme.dropdownBg }}
                renderRightIcon={() => (
                  <Ionicons
                    name="chevron-down"
                    size={moderateScale(15)}
                    color="#888"
                  />
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
                    <Text style={{ color: theme.text }}>{item.label}</Text>
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

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = {
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
    marginBottom: verticalScale(10),
  },
  headingText: {
    fontSize: moderateScale(18),
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
    marginTop: verticalScale(10),
    marginBottom: verticalScale(4),
  },
  dropdown: {
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    marginBottom: verticalScale(12),
  },
  placeholderStyle: {
    color: '#888',
  },
  selectedTextStyle: {
    color: '#fff',
  },
  input: {
    // backgroundColor: '#1f2937',
    height: verticalScale(40),
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    color: '#fff',
    marginBottom: verticalScale(12),
  },
  submitBtn: {
    backgroundColor: '#4CAF50',
    marginTop: verticalScale(20),
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
};

export default React.memo(AddTransactionScreen);
