import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { useAuthRequest, ResponseType } from "expo-auth-session";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignUpScreen from "./SignUpScreen";
import LoginScreen from "./LoginScreen";
import CreatePlaylistScreen from "./CreatePlaylistScreen";
import PlaylistScreen from "./PlaylistScreen";

WebBrowser.maybeCompleteAuthSession();
const Stack = createStackNavigator();

function MainScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "15583efa68154211a31ca3a901d13c71",
      scopes: [
        "user-read-email",
        "user-read-private",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private",
      ],
      redirectUri: "exp://exp.host/@rkibel/syncopace",
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      handleSignInResponse();
    }
  }, [response]);

  const handleSignInResponse = async () => {
    if (response?.type === "success") {
      setLoading(true);
      setError(null);
      try {
        const { access_token } = response.params;
        setAccessToken(access_token);

        const userResponse = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userData = await userResponse.json();
        setUserInfo(userData);
      } catch (e) {
        setError("Failed to get user information");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSpotifyLogin = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      setError("Failed to start sign in");
      console.error(e);
    }
  };

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
          <Text style={[styles.title, styles.lightText]}>
            Welcome, {userInfo.display_name}!
          </Text>
          <Text style={styles.lightText}>You're successfully logged in</Text>
          <TouchableOpacity
            style={styles.createPlaylistButton}
            onPress={() => navigation.navigate("CreatePlaylist", {accessToken})}
          >
            <Text style={styles.buttonText}>Create Playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUserInfo(null)}
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
            We match your pace.{"\n"}
            You enjoy the music.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.spotifyButton}
              onPress={handleSpotifyLogin}
            >
              <Text style={styles.buttonText}>LOGIN WITH SPOTIFY</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.termsText}>
            By clicking on Sign Up, you agree to syncopace's Terms and
            Conditions of Use.
          </Text>
        </View>
      )}
      <StatusBar style="light" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "#121212" },
        }}
      >
        <Stack.Screen name="Main" component={MainScreen} />
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
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 180,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2196F3",
  },
  tagline: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
    lineHeight: 32,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
  },
  spotifyButton: {
    backgroundColor: "#1DB954",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  signUpButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "transparent",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    marginBottom: 100,
  },
  createPlaylistButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  termsText: {
    color: "#B3B3B3",
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  signOutButton: {
    backgroundColor: "#282828",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  lightText: {
    color: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
});
