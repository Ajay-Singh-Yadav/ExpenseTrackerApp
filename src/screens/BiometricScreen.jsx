import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeModules } from 'react-native';

const { BiometricModule } = NativeModules;

const BiometricScreen = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const success = await BiometricModule.authenticate();
      if (success) {
        onSuccess(); // ✅ AppNavigation me state update hoga
      }
    } catch (error) {
      console.log('Biometric Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Automatically biometric popup dikhana (splash ke baad)
  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unlock App</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>Verify with Biometrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BiometricScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#4a90e2', padding: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontSize: 16 },
});
