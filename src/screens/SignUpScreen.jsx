import React, { use, useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';

import { AuthContext } from '../navigation/AuthContext';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const { login } = useContext(AuthContext);

  const auth = getAuth();

  const handleSignUp = async () => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password,
      );

      await userCredential.user.updateProfile({ displayName: name });

      // Call context login
      login();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'That email address is already in use!' });
      } else if (error.code === 'auth/invalid-email') {
        setErrors({ email: 'That email address is invalid!' });
      } else if (error.code === 'auth/weak-password') {
        setErrors({ password: 'Password should be at least 6 characters' });
      } else {
        console.log(error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo?.idToken || userInfo?.data?.idToken;
      console.log('ID Token:', idToken);
      if (!idToken) {
        Alert.alert('Error', 'Failed to retrieve ID token.');
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
      <Text style={styles.SignUpText}>Sign Up</Text>
      <Text style={styles.title}>Let's</Text>
      <Text style={styles.titleBold}>Get Started</Text>
      <Text style={styles.subtitle}>
        Create an account to track your expenses
      </Text>

      {/* Name Input */}

      <View style={styles.inputContainer}>
        <Ionicons
          name="person"
          size={moderateScale(16)}
          color="#aaa"
          style={styles.icon}
        />
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Input */}

      <View style={styles.inputContainer}>
        <Ionicons
          name="mail"
          size={moderateScale(16)}
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
          size={moderateScale(16)}
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
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Already have account */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
          <Text style={styles.loginLink}>LogIn</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.SocialText}>Social Login?</Text>

      <View style={styles.SocialContainer}>
        {/* Number LogIn */}
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

        {/* Google */}
        <TouchableOpacity
          style={styles.SocialButtons}
          onPress={handleGoogleSignIn}
        >
          <Image
            source={require('../assets/images/Google.png')}
            style={{ width: moderateScale(40), height: moderateScale(40) }}
            resizeMode="cover"
          />
          <Text style={styles.SocialLoginText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.SocialButtons}>
          <Image
            source={require('../assets/images/facebook.png')}
            style={{ width: moderateScale(40), height: moderateScale(40) }}
            resizeMode="cover"
          />
          <Text style={styles.SocialLoginText}>Facebook</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    padding: moderateScale(20),
  },
  SignUpText: {
    fontSize: moderateScale(25),
    color: '#fff',
    fontWeight: 'bold',
    marginTop: verticalScale(30),
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
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    height: verticalScale(35),
  },
  button: {
    backgroundColor: '#A3E635',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(25),
  },
  buttonText: {
    color: '#111827',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: moderateScale(14),
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
    marginTop: verticalScale(35),
  },

  SocialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginHorizontal: scale(30),
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
