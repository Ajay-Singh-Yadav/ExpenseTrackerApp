import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '555583208374-uler3lak1dorme2ipstvhrdggn5v35jd.apps.googleusercontent.com',
});
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../navigation/AuthContext';
import {
  moderateScale,
  s,
  scale,
  verticalScale,
} from 'react-native-size-matters';

const facebookImage = require('../assets/images/facebook.png');
const GoogleImage = require('../assets/images/Google.png');

const LogInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigation = useNavigation();

  const { login } = useContext(AuthContext);

  const auth = getAuth();

  const handleLogIn = async () => {
    setEmailLoading(true);
    try {
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password,
      );
      login();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('No user found for that email.');
      } else if (error.code === 'auth/wrong-password') {
        console.log('Incorrect password.');
      } else {
        console.log(error.message);
      }
    }
    setEmailLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.idToken || userInfo?.data?.idToken;

      console.log('ID Token:', idToken);
      if (!idToken) {
        Alert.alert('Error', 'Failed to retrieve ID token.');
        setGoogleLoading(false);
        return;
      }
      const googleCredential = GoogleAuthProvider.credential(idToken);
      const firebaseUserCredential = await signInWithCredential(
        auth,
        googleCredential,
      );

      const user = firebaseUserCredential.user;
      if (user) {
        login();
      }
    } catch (error) {
      console.log('Google Sign-In Error:', error);
      setGoogleLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available or outdated.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred during sign-in.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.LogInText}>LogIn</Text>

      <Text style={styles.title}>Let's</Text>
      <Text style={styles.titleBold}>Get Started</Text>
      <Text style={styles.subtitle}>
        Create an account to track your expenses
      </Text>

      {/* Email Input */}

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail"
          size={moderateScale(15)}
          color="#aaa"
          style={styles.icon}
        />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password Input */}

      <View style={styles.inputContainer}>
        <Ionicons
          name="lock-closed"
          size={moderateScale(15)}
          color="#aaa"
          style={styles.icon}
        />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogIn}
        disabled={emailLoading || googleLoading}
      >
        {googleLoading ? (
          <ActivityIndicator size="small" color="#111827" />
        ) : (
          <Text style={styles.buttonText}>LogIn</Text>
        )}
      </TouchableOpacity>

      {/* Already have account */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.loginLink}>SignUp</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.SocialText}>Social Login?</Text>

      <View style={styles.SocialContainer}>
        <TouchableOpacity
          style={styles.SocialButtons}
          onPress={() => navigation.navigate('NumberLogIn')}
        >
          <Entypo
            name="mobile"
            size={moderateScale(30)}
            color="#fff"
            style={{ marginRight: scale(8), alignItems: 'center' }}
          />
          <Text
            style={[styles.SocialLoginText, { marginTop: verticalScale(10) }]}
          >
            Mobile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.SocialButtons}
          onPress={handleGoogleSignIn}
        >
          <Image
            source={GoogleImage}
            style={{ width: moderateScale(40), height: moderateScale(40) }}
            resizeMode="cover"
          />
          <Text style={styles.SocialLoginText}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SocialButtons}>
          <Image
            source={facebookImage}
            style={{ width: moderateScale(40), height: moderateScale(40) }}
            resizeMode="cover"
          />
          <Text style={styles.SocialLoginText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LogInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: moderateScale(20),
  },
  LogInText: {
    fontSize: moderateScale(25),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: verticalScale(40),
    textAlign: 'center',
  },
  title: {
    fontSize: moderateScale(25),
    color: '#fff',
    fontWeight: '400',
    marginTop: verticalScale(25),
  },
  titleBold: {
    fontSize: moderateScale(25),
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#aaa',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
    marginVertical: verticalScale(20),
  },
  icon: {
    marginRight: scale(6),
  },
  input: {
    flex: 1,
    color: '#fff',
    height: verticalScale(35),
  },
  button: {
    backgroundColor: '#A3E635',
    paddingVertical: 15,
    borderRadius: moderateScale(10),
    marginTop: verticalScale(20),
  },
  buttonText: {
    color: '#111827',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: moderateScale(15),
  },
  bottomText: {
    color: '#aaa',
    textAlign: 'center',
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: verticalScale(20),
  },
  loginLink: {
    color: '#A3E635',
    fontWeight: 'bold',
  },
  SocialText: {
    color: '#fff',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: verticalScale(40),
  },

  SocialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(20),
    marginHorizontal: scale(20),
  },
  SocialLoginText: {
    color: '#fff',
    fontWeight: '200',
    textAlign: 'center',
    fontSize: moderateScale(10),
  },
  SocialButtons: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
