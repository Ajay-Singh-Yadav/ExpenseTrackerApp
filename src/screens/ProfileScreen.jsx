import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../navigation/AuthContext';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import auth from '@react-native-firebase/auth';
import { ProfileModal } from '../components/ProfileModal';
import { SettingsModal } from '../components/SettingsModal';
import { useTheme } from '../constants/ThemeContext';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { logout } = useContext(AuthContext);

  const [isSettingsVisible, setSettingsVisible] = useState(false);
  const [isPrivacyVisible, setPrivacyVisible] = useState(false);

  const user = auth().currentUser;

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  }, [logout]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bgColor }]}>
      {/* Profile Header */}

      <Text style={[styles.headerText, { color: theme.statisticsText }]}>
        Profile
      </Text>
      <View style={styles.header}>
        <Image
          source={
            user.photoURL
              ? { uri: user.photoURL }
              : require('../assets/images/boy.png')
          }
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: theme.text }]}>
          {user.displayName}
        </Text>
        <Text style={[styles.email, { color: theme.emailText }]}>
          {user.email}
        </Text>
      </View>

      {/* Options List */}
      <View style={styles.options}>
        <OptionItem icon="person" label="Edit Profile" iconColor="#fff" />
        <OptionItem
          icon="settings"
          label="Settings"
          iconColor="#fff"
          onPress={() => setSettingsVisible(true)}
          theme={theme}
        />
        <OptionItem
          icon="lock-closed"
          label="Privacy Policy"
          iconColor="#fff"
          onPress={() => setPrivacyVisible(true)}
          theme={theme}
        />
        <OptionItem
          icon="power"
          label="Logout"
          iconColor="#fff"
          withBg={true}
          onPress={handleLogout}
          theme={theme}
        />
      </View>

      {isPrivacyVisible && (
        <ProfileModal
          visible={true}
          onClose={() => setPrivacyVisible(false)}
          title="Privacy Policy"
        />
      )}
      {isSettingsVisible && (
        <SettingsModal
          visible={true}
          onClose={() => setSettingsVisible(false)}
          title="Settings"
          theme={theme}
        />
      )}
    </View>
  );
};

const OptionItem = React.memo(
  ({ icon, label, iconColor, onPress, withBg = false }) => (
    <TouchableOpacity style={[styles.optionRow]} onPress={onPress}>
      <View
        style={[
          styles.optionIconBox,
          { backgroundColor: withBg ? `${iconColor}22` : 'transparent' },
        ]}
      >
        <Ionicons name={icon} size={moderateScale(20)} color={iconColor} />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
      <MaterialCommunityIcons
        name="chevron-right"
        size={moderateScale(20)}
        color="#888"
        style={{ marginLeft: 'auto' }}
      />
    </TouchableOpacity>
  ),
);

export default React.memo(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(10),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
    marginTop: verticalScale(15),
  },
  headerText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  avatar: {
    width: scale(78),
    height: verticalScale(70),
    borderRadius: moderateScale(60),
    marginBottom: verticalScale(8),
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  email: {
    fontSize: moderateScale(12),
  },
  options: {},
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: moderateScale(8),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
    elevation: 5,
  },
  optionIconBox: {
    width: scale(35),
    height: scale(35),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: moderateScale(12),
    color: '#fff',
  },
});
