import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

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
      redirectUri: makeRedirectUri({
        scheme: 'exp',
        // NOTE: change to your OWN expo IP when running locally
        // Where it says "Metro waiting on exp://<IP here>"
        // Ron: 169.231.26.134:8081
        host: '192.168.0.40:8081'
      }),
    },
    {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize',
      tokenEndpoint: 'https://accounts.spotify.com/api/token',
    }
  );

  useEffect(() => {
    handleSignInResponse();
  }, [response]);

  const handleSignInResponse = async () => {
    if (response?.type === 'success') {
      setLoading(true);
      setError(null);
      try {
        const { access_token } = response.params;
        setAccessToken(access_token);

        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userData = await userResponse.json();
        setUserInfo(userData);
      } catch (e) {
        setError('Failed to get user information');
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      setError('Authentication failed');
    }
  };

  const handleSignIn = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      setError('Failed to start sign in');
      console.error(e);
    }
  };

if (showSignUp) {
  return <SignUpScreen onSwitchToLogin={() => setShowSignUp(false) || setShowLogin(true)} />;
}

if (showLogin) {
  return <LoginScreen />;
}


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          <Text style={[styles.title, styles.lightText]}>Welcome, {userInfo.display_name}!</Text>
          <Text style={styles.lightText}>You're successfully logged in</Text>
          <TouchableOpacity
            onPress={() => setUserInfo(null)}
            style={styles.signOutButton}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.appTitle, styles.lightText]}>SyncoPace</Text>
          </View>
          
          {/* Email Sign Up Button */}
          <TouchableOpacity
            style={styles.spotifyButton}
            onPress={() => setShowSignUp(true)}
          >
            <Text style={styles.buttonText}>Sign Up with Email</Text>
          </TouchableOpacity>
          
          {/* Email Login Button */}
          <TouchableOpacity
            style={styles.spotifyButton}
            onPress={() => setShowLogin(true)}
          >
            <Text style={styles.buttonText}>Login with Email</Text>
          </TouchableOpacity>
  
          {/* Spotify OAuth Button */}
          <TouchableOpacity
            disabled={!request}
            onPress={handleSignIn}
            style={styles.spotifyButton}>
            <Text style={styles.buttonText}>Sign Up with Spotify</Text>
          </TouchableOpacity>
  
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lightText: {
    color: '#FFFFFF',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  signOutButton: {
    backgroundColor: '#282828',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: '#ff4444',
    marginTop: 10,
  },
  appTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1DB954',
  },
});