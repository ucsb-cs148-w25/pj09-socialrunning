import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function SignUpScreen({ onSwitchToLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully!');
      // Automatically navigate to the login screen after successful sign up
      if (onSwitchToLogin) onSwitchToLogin();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up with Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSwitchToLogin} style={styles.loginButton}>
        <Text style={styles.buttonText}>Already have an account? Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20
  },
  input: {
    width: '80%',
    backgroundColor: '#282828',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8
  },
  signUpButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10
  },
  loginButton: {
    backgroundColor: '#282828',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10
  },
  backButton: {
    backgroundColor: '#282828',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  error: {
    color: '#ff4444',
    marginTop: 10,
    textAlign: 'center'
  }
});
