import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Switch,
  NativeModules,
  Alert,
} from 'react-native';

const { BiometricModule } = NativeModules;

import AsyncStorage from '@react-native-async-storage/async-storage';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height } = Dimensions.get('window');
import { useTheme } from '../constants/ThemeContext';
import { moderateScale } from 'react-native-size-matters';
import { CurrencyModal } from './CurrencyModal';

const themeOptions = ['dark', 'light', 'coffee', 'forest'];

export const SettingsModal = React.memo(({ visible, onClose, title }) => {
  const { toggleTheme, themeKey, theme } = useTheme();

  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themeKey);

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isCurrencyModal, setIsisCurrencyModal] = useState(false);

  const handleBiometricToggle = async () => {
    if (!isBiometricEnabled) {
      try {
        const success = await BiometricModule.authenticate();
        if (success) {
          setIsBiometricEnabled(true);
          await AsyncStorage.setItem('biometricEnabled', 'true'); // save
        } else {
          setIsBiometricEnabled(false);
          await AsyncStorage.setItem('biometricEnabled', 'false');
        }
      } catch (error) {
        setIsBiometricEnabled(false);
        await AsyncStorage.setItem('biometricEnabled', 'false');
      }
    } else {
      // ✅ Agar pehle se ON hai → OFF karne pe disable
      setIsBiometricEnabled(false);
      await AsyncStorage.setItem('biometricEnabled', 'false');
    }
  };

  // const toggleSwitch = () => {
  //   setIsBiometricEnabled(previousState => !previousState);
  // };

  const handleThemeSelect = theme => {
    setSelectedTheme(theme);
    toggleTheme(theme);
    setThemeModalVisible(false);
  };

  useEffect(() => {
    const loadBiometricSetting = async () => {
      const savedValue = await AsyncStorage.getItem('biometricEnabled');
      if (savedValue === 'true') {
        setIsBiometricEnabled(true);
      } else {
        setIsBiometricEnabled(false);
      }
    };
    loadBiometricSetting();
  }, []);

  useEffect(() => {
    if (visible) {
      setSelectedTheme(themeKey);
    }
  }, [visible]);

  const openThemeModal = useCallback(() => setThemeModalVisible(true), []);

  const openCurrencyModal = useCallback(() => setIsisCurrencyModal(true), []);

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.modalOverLayBg },
          ]}
        >
          <View
            style={[styles.fullScreenModal, { backgroundColor: theme.modalBg }]}
          >
            {/* Header */}
            <View style={styles.headerConatiner}>
              <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Ionicons name="chevron-back" size={25} color="#fff" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                {title}
              </Text>
            </View>

            {/* Theme Button */}
            <TouchableOpacity
              style={styles.ThemeButton}
              onPress={openThemeModal}
            >
              <Text style={[styles.ThemeText, { color: theme.text }]}>
                🎨 Theme
              </Text>
              <Ionicons name="chevron-forward" size={25} color={theme.text} />
            </TouchableOpacity>

            <CurrencyModal
              visible={isCurrencyModal}
              onClose={() => setIsisCurrencyModal(false)}
              title={'Select Currency'}
            />

            {/* Currency */}
            <TouchableOpacity
              style={styles.ThemeButton}
              onPress={openCurrencyModal}
            >
              <View style={styles.SettingsRowContainer}>
                <MaterialIcons
                  name="currency-exchange"
                  size={22}
                  color="#fff"
                />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Currency
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={25} color={theme.text} />
            </TouchableOpacity>

            {/* Notifications */}
            <TouchableOpacity style={styles.ThemeButton}>
              <View style={styles.SettingsRowContainer}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={25} color={theme.text} />
            </TouchableOpacity>

            {/* App Lock */}
            <View style={styles.appLockContainer}>
              <View style={styles.appLockRow}>
                <Ionicons name="lock-closed-outline" size={24} color="#fff" />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  App Lock
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={isBiometricEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={handleBiometricToggle}
                value={isBiometricEnabled}
              />
            </View>

            {/*  */}
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        visible={themeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: theme.modalOverLayBg },
          ]}
        >
          <View
            style={[styles.fullScreenModal, { backgroundColor: theme.modalBg }]}
          >
            {/* Header */}
            <View style={styles.headerConatiner}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setThemeModalVisible(false)}
              >
                <Ionicons name="chevron-back" size={25} color="#fff" />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Choose Theme
              </Text>
            </View>

            {themeOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={styles.radioContainer}
                onPress={() => handleThemeSelect(option)}
              >
                <View
                  style={[
                    styles.radioCircle,
                    { borderColor: theme.radioCircleBg },
                  ]}
                >
                  {selectedTheme === option && (
                    <View
                      style={[
                        styles.selectedRb,
                        { backgroundColor: theme.selectedRb },
                      ]}
                    />
                  )}
                </View>
                <Text style={[styles.radioText, { color: theme.text }]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#374151',
    borderRadius: 10,
    marginRight: 10,
    padding: 5,
    alignItems: 'center',
  },
  ThemeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  ThemeText: {
    fontSize: 16,
    color: '#fff',
  },
  fullScreenModal: {
    height: height * 1,
    width: '100%',
    padding: 20,

    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  modalText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    color: '#fff',
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
  },
  text: {
    fontSize: 15,
    color: '#9ca3af',
    lineHeight: 22,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  radioText: {
    color: '#fff',
    fontSize: 16,
  },
  appLockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: moderateScale(5),
  },
  appLockRow: {
    flexDirection: 'row',
    gap: moderateScale(5),
  },
  SettingsRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(5),
  },
});
