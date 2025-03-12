import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import CreatePlaylistScreen from './CreatePlaylistScreen';
import PlaylistScreen from './PlaylistScreen';

const Stack = createStackNavigator();

function MainScreen({ navigation, route }) {
  const { userInfo, setUserInfo } = route.params;
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignOut = () => {
    route.params.setUserInfo(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleAIGeneratePlaylist = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a mood or genre to generate a playlist.');
      return;
    }

    setLoading(true);

    try {

      const response = await fetch('http://169.231.219.152:5001/generate_ai_playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          access_token: userInfo.spotify_token,
        }),
      });

      const data = await response.json();

      const filteredData = {
        message: data.message,
        playlist_id: data.playlist_id,
        playlist_url: data.playlist_url
      };

      if (response.ok) {
        navigation.navigate('PlaylistScreen', {
          playlist: filteredData, 
          playlistId: filteredData.playlist_id,
          zone: data.zone || null, 
          songs: data.added_songs || [], 
          missingSongs: data.missing_songs || [] 
        });
        
      } else {
        Alert.alert('Error', data.error || 'Failed to create playlist.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          <Text style={[styles.title, styles.lightText]}>Welcome, {userInfo.display_name}!</Text>
          <Text style={styles.lightText}>You're successfully logged in</Text>

          {/* Text Input for User Query */}
          <TextInput
            style={styles.input}
            placeholder="Type in your mood, we generate the playlist"
            placeholderTextColor="#ccc"
            value={query}
            onChangeText={setQuery}
          />

          {/* Generate AI Playlist Button */}
          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : (
            <TouchableOpacity style={styles.generatePlaylistButton} onPress={handleAIGeneratePlaylist}>
              <Text style={styles.buttonText}>Generate AI Playlist</Text>
            </TouchableOpacity>
          )}

          {/* Create Playlist Button */}
          <TouchableOpacity
            style={styles.createPlaylistButton}
            onPress={() => navigation.navigate('CreatePlaylist', { accessToken: userInfo.spotify_token })}
          >
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>

          {/* Sign Out Button */}
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.appTitle}>syncopace</Text>
          </View>
          <Text style={styles.tagline}>
            We match your pace.{'\n'}
            You enjoy the music.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By clicking on Sign Up, you agree to syncopace's Terms and Conditions of Use.
          </Text>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#121212' },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          initialParams={{
            userInfo,
            setUserInfo: (newUserInfo) => {
              setUserInfo(newUserInfo);
            }
          }}
        />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
        <Stack.Screen name="PlaylistScreen" component={PlaylistScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  tagline: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    lineHeight: 32,
  },
  input: {
    width: '100%',
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  generatePlaylistButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'stretch',  
    width: '100%',  
    alignItems: 'center', 
  },
  createPlaylistButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'stretch', 
    width: '100%',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    borderRadius: 25,
    marginVertical: 10,
    alignSelf: 'stretch',
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButton: {
    backgroundColor: '#2196F3',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginBottom: 100,
  },
  termsText: {
    color: '#B3B3B3',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  lightText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});
