import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
  const [accessToken, setAccessToken] = useState(null);

  const handleSignOut = () => {
    route.params.setUserInfo(null);
    setAccessToken(null);

    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          <Text style={[styles.title, styles.lightText]}>Welcome, {userInfo.display_name}!</Text>
          <Text style={styles.lightText}>You're successfully logged in</Text>
          <TouchableOpacity
            style={styles.createPlaylistButton}
            onPress={() => navigation.navigate('CreatePlaylist', { accessToken: userInfo.spotify_token })}
          >
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.signOutButton}
          >
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
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
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
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 180,
    paddingBottom: 80,
    paddingHorizontal: 20,
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
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
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
  createPlaylistButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  termsText: {
    color: '#B3B3B3',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  signOutButton: {
    backgroundColor: '#282828',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  lightText: {
    color: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});