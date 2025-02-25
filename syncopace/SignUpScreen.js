// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '15583efa68154211a31ca3a901d13c71',
      scopes: [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'playlist-modify-public',
        'playlist-modify-private'
      ],
      redirectUri: 'exp://exp.host/@rkibel/syncopace',
    },
    {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
  );

  const handleSpotifySignUp = async () => {
    try {
      const response = await promptAsync();
      if (response?.type === 'success') {
        const { access_token } = response.params;
        console.log('Spotify access token:', access_token);

        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userData = await userResponse.json();
        console.log('Spotify signup successful! User data:', JSON.stringify(userData, null, 2));

        const formattedUserData = {
          display_name: userData.display_name,
          email: userData.email,
          uid: userData.id,
          spotify_token: access_token
        };

        // Update parent state and navigate
        if (route.params?.onLoginSuccess) {
          route.params.onLoginSuccess(formattedUserData);
        }

        // Reset navigation to Main screen with user data
        navigation.reset({
          index: 0,
          routes: [{
            name: 'Main',
            params: { userInfo: formattedUserData }
          }],
        });
      }
    } catch (err) {
      console.error('Spotify signup error:', err);
      setError('Failed to sign up with Spotify');
    }
  };

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
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>syncopace</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#B3B3B3"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B3B3B3"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
          <Text style={styles.buttonText}>SIGN UP</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.spotifyButton}
          onPress={handleSpotifySignUp}
        >
          <Text style={styles.spotifyButtonText}>SIGN UP WITH SPOTIFY</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginRedirectButton}>
          <Text style={styles.loginRedirectText}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: 180,
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#282828',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: '#2196F3', // Changed from '#1DB954' to blue
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotifyButton: {
    backgroundColor: '#1DB954', // Spotify's green color
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  spotifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginRedirectButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginRedirectText: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#282828',
  },
  dividerText: {
    color: '#B3B3B3',
    paddingHorizontal: 16,
    fontSize: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
});
