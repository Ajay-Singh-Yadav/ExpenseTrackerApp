// import React, { useCallback, useContext, useMemo, useState } from 'react';
// import { WalletContext } from '../constants/WalletContext';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Modal,
//   TextInput,
//   KeyboardAvoidingView,
//   ActivityIndicator,
// } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';

// import { useQuery } from '@apollo/client';
// import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
// import { useNavigation } from '@react-navigation/native';
// import { useTheme } from '../constants/ThemeContext';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// const WalletScreen = () => {
//   const { theme } = useTheme();
//   const { loading, error, data } = useQuery(GET_TRANSACTIONS);
//   const [modalVisible, setModalVisible] = useState(false);

//   const navigation = useNavigation();

//   const { addWallet } = useContext(WalletContext);
//   const [walletName, setWalletName] = useState('');

//   const transactions = data?.transactions || [];

//   const totalIncome = useMemo(
//     () =>
//       transactions
//         .filter(t => t.type === 'income')
//         .reduce((sum, t) => sum + parseFloat(t.amount), 0),
//     [transactions],
//   );

//   const totalExpense = useMemo(
//     () =>
//       transactions
//         .filter(t => t.type === 'expense')
//         .reduce((sum, t) => sum + parseFloat(t.amount), 0),
//     [transactions],
//   );

//   const totalBalance = totalIncome - totalExpense;

//   const incomePerWallet = {};

//   transactions.forEach(tx => {
//     if (tx.type === 'income') {
//       const wallet = tx.wallet;
//       const amount = parseFloat(tx.amount);
//       if (!incomePerWallet[wallet]) {
//         incomePerWallet[wallet] = 0;
//       }
//       incomePerWallet[wallet] += amount;
//     }
//   });

//   const walletBalances = {};
//   transactions.forEach(tx => {
//     const wallet = tx.wallet;
//     const amount = parseFloat(tx.amount);
//     if (!walletBalances[wallet]) {
//       walletBalances[wallet] = 0;
//     }

//     if (tx.type === 'income') {
//       walletBalances[wallet] += amount;
//     } else if (tx.type === 'expense') {
//       walletBalances[wallet] -= amount;
//     }
//   });

//   const walletList = Object.keys(walletBalances).map((wallet, index) => ({
//     id: String(index),
//     name: wallet,
//     value: wallet,
//     currentBalance: walletBalances[wallet], // income - expense
//     initialIncome: incomePerWallet[wallet] || 0, // only income
//     image: require('../assets/images/splashImage.png'),
//   }));

//   const handleWallet = () => {
//     if (walletList.length >= 5) {
//       alert('You can only create up to 5 wallets.');
//       return;
//     }

//     if (!walletName.trim()) return;

//     addWallet(walletName);
//     setWalletName('');
//     closeModal();
//   };

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setWalletName('');
//   };

//   const renderWallet = ({ item }) => (
//     <TouchableOpacity
//       style={styles.walletRow}
//       onPress={() =>
//         navigation.navigate('WalletTransactions', { wallet: item.name })
//       }
//     >
//       <Image source={item.image} style={styles.walletImage} />
//       <View>
//         <Text style={styles.walletName}>
//           {' '}
//           {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
//         </Text>
//         <Text style={styles.walletAmount}>
//           ₹ {item.currentBalance} left of ₹ {item.initialIncome}
//         </Text>
//       </View>
//       <Icon
//         name="chevron-right"
//         size={24}
//         color="#888"
//         style={{ marginLeft: 'auto' }}
//       />
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: '#111827',
//         }}
//       >
//         <ActivityIndicator size="large" color="#9DFF00" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//           backgroundColor: '#111827',
//         }}
//       >
//         <Text style={{ color: 'red', padding: 16 }}>
//           Error: {error.message}
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView
//       style={[styles.container, { backgroundColor: theme.bgColor }]}
//     >
//       <Text style={[styles.header, { color: theme.statisticsText }]}>
//         Wallet
//       </Text>
//       <Text style={[styles.balance, { color: theme.text }]}>
//         ₹ {totalBalance.toFixed(2)}
//       </Text>
//       <Text style={styles.subText}>Total balance</Text>

//       <View style={[styles.card, { backgroundColor: theme.commonBg }]}>
//         <View style={styles.cardHeader}>
//           <Text style={styles.cardTitle}>My Wallets</Text>
//           <TouchableOpacity onPress={openModal}>
//             <Icon name="add-circle" size={26} color="#9DFF00" />
//           </TouchableOpacity>
//         </View>

//         <FlatList
//           data={walletList}
//           keyExtractor={item => item.id}
//           renderItem={renderWallet}
//         />
//       </View>

//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalOverlay}>
//           <TouchableOpacity
//             style={{ flex: 1 }}
//             activeOpacity={1}
//             onPress={closeModal}
//           />
//           <KeyboardAvoidingView
//             behavior="padding"
//             keyboardVerticalOffset={40}
//             style={[
//               styles.keyboardView,
//               { backgroundColor: theme.modalContainer },
//             ]}
//           >
//             <Text style={[styles.modalTitle, { color: theme.statisticsText }]}>
//               Add Wallet
//             </Text>
//             <Text style={[styles.iconText, { color: theme.text }]}>
//               Wallet Name
//             </Text>
//             <TextInput
//               placeholder="Wallet name"
//               value={walletName}
//               onChangeText={setWalletName}
//               style={styles.input}
//               placeholderTextColor="#888"
//             />

//             <Text style={[styles.iconText, { color: theme.text }]}>
//               Wallet Icon <Text style={styles.optionalText}>(optional)</Text>
//             </Text>
//             <TouchableOpacity style={styles.uploadButton}>
//               <Feather name="upload" size={24} color="white" />
//               <Text style={styles.uploadButtonText}>Upload Image</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={handleWallet} style={styles.saveButton}>
//               <Text style={styles.saveButtonText}>Save</Text>
//             </TouchableOpacity>
//           </KeyboardAvoidingView>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default WalletScreen;

// const styles = StyleSheet.create({
//   container: {
//     padding: scale(16),
//     flexGrow: 1,
//   },
//   header: {
//     fontSize: moderateScale(18),
//     fontWeight: '700',
//   },

//   balance: {
//     fontSize: moderateScale(28),
//     textAlign: 'center',
//     fontWeight: 'bold',
//     marginTop: verticalScale(20),
//   },
//   subText: {
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: verticalScale(20),
//   },
//   card: {
//     borderRadius: moderateScale(16),
//     padding: moderateScale(16),
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: verticalScale(12),
//     alignItems: 'center',
//   },
//   cardTitle: {
//     color: '#fff',
//     fontSize: moderateScale(14),
//     fontWeight: '600',
//   },
//   walletRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: verticalScale(14),
//     paddingBottom: verticalScale(10),
//     borderBottomColor: '#333',
//     borderBottomWidth: 1,
//   },
//   walletImage: {
//     width: scale(40),
//     height: scale(40),
//     borderRadius: moderateScale(10),
//     marginRight: scale(12),
//   },
//   walletName: {
//     color: '#fff',
//     fontSize: moderateScale(14),
//     fontWeight: '500',
//   },
//   walletAmount: {
//     color: '#9DFF00',
//     fontSize: moderateScale(10),
//   },
//   keyboardView: {
//     borderTopLeftRadius: moderateScale(20),
//     borderTopRightRadius: moderateScale(20),
//     maxHeight: '90%',
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'flex-end',
//   },
//   modalTitle: {
//     fontSize: moderateScale(18),
//     fontWeight: 'bold',
//     color: '#fff',

//     marginHorizontal: scale(20),
//     textAlign: 'center',
//     marginTop: verticalScale(10),
//   },
//   input: {
//     borderColor: '#888',
//     borderWidth: 1,
//     padding: moderateScale(10),
//     borderRadius: moderateScale(10),
//     color: '#fff',
//     marginBottom: verticalScale(8),
//     marginHorizontal: scale(20),
//   },
//   saveButton: {
//     marginTop: verticalScale(10),
//     backgroundColor: '#22c55e',
//     padding: moderateScale(12),
//     borderRadius: moderateScale(10),
//     alignItems: 'center',
//     marginBottom: verticalScale(15),
//     marginHorizontal: scale(20),
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: moderateScale(14),
//   },
//   iconText: {
//     color: '#fff',
//     fontSize: moderateScale(14),
//     marginTop: verticalScale(12),
//     marginBottom: verticalScale(6),
//     marginHorizontal: scale(20),
//   },
//   optionalText: {
//     color: '#888',
//     fontSize: moderateScale(10),
//   },
//   uploadButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111827',
//     borderRadius: moderateScale(10),
//     padding: moderateScale(12),
//     marginBottom: verticalScale(16),
//     justifyContent: 'center',
//     gap: scale(10),
//     marginHorizontal: scale(20),
//   },
//   uploadButtonText: {
//     color: '#fff',
//     fontSize: moderateScale(14),
//   },
// });

import React, { useContext, useMemo, useState } from 'react';
import { WalletContext } from '../constants/WalletContext';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transactions';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../constants/ThemeContext';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Memoized Wallet Row Component
const WalletRow = React.memo(({ wallet, navigation }) => (
  <TouchableOpacity
    style={styles.walletRow}
    onPress={() =>
      navigation.navigate('WalletTransactions', { wallet: wallet.name })
    }
  >
    <Image source={wallet.image} style={styles.walletImage} />
    <View>
      <Text style={styles.walletName}>
        {wallet.name.charAt(0).toUpperCase() + wallet.name.slice(1)}
      </Text>
      <Text style={styles.walletAmount}>
        ₹ {wallet.currentBalance} left of ₹ {wallet.initialIncome}
      </Text>
    </View>
    <Icon
      name="chevron-right"
      size={24}
      color="#888"
      style={{ marginLeft: 'auto' }}
    />
  </TouchableOpacity>
));

const WalletScreen = () => {
  const { theme } = useTheme();
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [walletName, setWalletName] = useState('');
  const navigation = useNavigation();
  const { addWallet } = useContext(WalletContext);

  const transactions = data?.transactions || [];

  // Single pass calculation for totals and wallet balances
  const { totalIncome, totalExpense, totalBalance, walletList } =
    useMemo(() => {
      let income = 0;
      let expense = 0;
      const balances = {};
      const incomeWallets = {};

      transactions.forEach(tx => {
        const amount = parseFloat(tx.amount);
        const wallet = tx.wallet;
        if (!balances[wallet]) balances[wallet] = 0;

        if (tx.type === 'income') {
          income += amount;
          balances[wallet] += amount;
          incomeWallets[wallet] = (incomeWallets[wallet] || 0) + amount;
        } else if (tx.type === 'expense') {
          expense += amount;
          balances[wallet] -= amount;
        }
      });

      const wallets = Object.keys(balances).map((wallet, idx) => ({
        id: String(idx),
        name: wallet,
        value: wallet,
        currentBalance: balances[wallet],
        initialIncome: incomeWallets[wallet] || 0,
        image: require('../assets/images/splashImage.png'),
      }));

      return {
        totalIncome: income,
        totalExpense: expense,
        totalBalance: income - expense,
        walletList: wallets,
      };
    }, [transactions]);

  const handleWallet = () => {
    if (walletList.length >= 5) {
      alert('You can only create up to 5 wallets.');
      return;
    }
    if (!walletName.trim()) return;
    addWallet(walletName);
    setWalletName('');
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9DFF00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: 'red', padding: 16 }}>
          Error: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.bgColor }]}
    >
      <Text style={[styles.header, { color: theme.statisticsText }]}>
        Wallet
      </Text>
      <Text style={[styles.balance, { color: theme.text }]}>
        ₹ {totalBalance.toFixed(2)}
      </Text>
      <Text style={styles.subText}>Total balance</Text>

      <View style={[styles.card, { backgroundColor: theme.commonBg }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>My Wallets</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name="add-circle" size={26} color="#9DFF00" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={walletList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <WalletRow wallet={item} navigation={navigation} />
          )}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={40}
            style={[
              styles.keyboardView,
              { backgroundColor: theme.modalContainer },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.statisticsText }]}>
              Add Wallet
            </Text>
            <Text style={[styles.iconText, { color: theme.text }]}>
              Wallet Name
            </Text>
            <TextInput
              placeholder="Wallet name"
              value={walletName}
              onChangeText={setWalletName}
              style={styles.input}
              placeholderTextColor="#888"
            />
            <Text style={[styles.iconText, { color: theme.text }]}>
              Wallet Icon <Text style={styles.optionalText}>(optional)</Text>
            </Text>
            <TouchableOpacity style={styles.uploadButton}>
              <Feather name="upload" size={24} color="white" />
              <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWallet} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: { padding: scale(5), flexGrow: 1 },
  header: { fontSize: moderateScale(18), fontWeight: '700' },
  balance: {
    fontSize: moderateScale(28),
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: verticalScale(20),
  },
  subText: {
    color: '#888',
    textAlign: 'center',
    marginBottom: verticalScale(20),
  },
  card: { borderRadius: moderateScale(16), padding: moderateScale(16) },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(12),
    alignItems: 'center',
  },
  cardTitle: { color: '#fff', fontSize: moderateScale(14), fontWeight: '600' },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
    paddingBottom: verticalScale(10),
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  walletImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(10),
    marginRight: scale(12),
  },
  walletName: { color: '#fff', fontSize: moderateScale(14), fontWeight: '500' },
  walletAmount: { color: '#9DFF00', fontSize: moderateScale(10) },
  keyboardView: {
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    maxHeight: '90%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginHorizontal: scale(20),
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  input: {
    borderColor: '#888',
    borderWidth: 1,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    color: '#fff',
    marginBottom: verticalScale(8),
    marginHorizontal: scale(20),
  },
  saveButton: {
    marginTop: verticalScale(10),
    backgroundColor: '#22c55e',
    padding: moderateScale(12),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    marginBottom: verticalScale(15),
    marginHorizontal: scale(20),
  },
  saveButtonText: { color: '#fff', fontSize: moderateScale(14) },
  iconText: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(6),
    marginHorizontal: scale(20),
  },
  optionalText: { color: '#888', fontSize: moderateScale(10) },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    marginBottom: verticalScale(16),
    justifyContent: 'center',
    gap: scale(10),
    marginHorizontal: scale(20),
  },
  uploadButtonText: { color: '#fff', fontSize: moderateScale(14) },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
});
