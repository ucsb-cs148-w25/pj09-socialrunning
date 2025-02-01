// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ onBack, onLoginSuccess }) {
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

  const handleSpotifyLogin = async () => {
    try {
      const response = await promptAsync();
      if (response?.type === 'success') {
        const { access_token } = response.params;

        // Fetch user info from Spotify
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userData = await userResponse.json();
        onLoginSuccess({
          display_name: userData.display_name,
          email: userData.email,
          uid: userData.id,
          spotify_token: access_token
        });
        navigation.navigate('Main', { userData: userData });
      }
    } catch (err) {
      setError('Failed to login with Spotify');
    }
  };

  const handleEmailLogin = async () => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      onLoginSuccess({
        display_name: user.email,
        email: user.email,
        uid: user.uid
      });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.appTitle}>syncopace</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email address or username"
          placeholderTextColor="#B3B3B3"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
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

        <TouchableOpacity onPress={handleEmailLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.spotifyButton}
          onPress={handleSpotifyLogin}
        >
          <Text style={styles.spotifyButtonText}>LOG IN WITH SPOTIFY</Text>
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
  loginButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  spotifyButton: {
    backgroundColor: '#1DB954', // Spotify's green color
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  spotifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 16,
  },
});
