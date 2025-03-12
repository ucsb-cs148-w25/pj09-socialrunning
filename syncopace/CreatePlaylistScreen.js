import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, 
  Alert, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
// import { play } from 'react-native-track-player/lib/src/trackPlayer';

export default function CreatePlaylistScreen() {
  const route = useRoute();
  const accessToken = route.params?.accessToken;
  const navigation = useNavigation();
  const [cardioZone, setCardioZone] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // console.log(accessToken)

  const handleCreatePlaylist = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    const zoneMapping = {
      zone1: 1,
      zone2: 2,
      zone3: 3,
      zone4: 4,
      zone5: 5,
    };

    try {
      const backendUrl = "http://169.231.101.0:5001/get_songs";

      // Fetch songs based on the selected cardio zone and duration
      const response = await fetch(
        `${backendUrl}?zone=${zoneMapping[cardioZone]}&duration=${duration}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.virtual_playlist) {
        throw new Error('Invalid response format from server');
      }

      const trackUris = data.virtual_playlist.tracks; // Spotify URIs
      if (trackUris.length === 0) {
        throw new Error("No valid songs found.");
      }

      // Now create the playlist in the user's Spotify account
      const createPlaylistUrl = "http://169.231.101.0:5001/create_playlist";

      const createPlaylistResponse = await fetch(createPlaylistUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken, // Ensure this is being passed from App.js
          playlist_name: `Syncopace Zone ${zoneMapping[cardioZone]} Playlist`,
          track_uris: trackUris,
        }),
      });

      if (!createPlaylistResponse.ok) {
        throw new Error(`Failed to create playlist in Spotify`);
      }

      const playlistData = await createPlaylistResponse.json();

      Alert.alert(
        "Playlist Created",
        `Your playlist has been added to your Spotify!`,
        [{ text: "OK" }]
      );
      
      // Navigate to the PlaylistScreen
      navigation.navigate("PlaylistScreen", {
        playlist: playlistData,
        playlistId: playlistData.playlist_id,
        zone: zoneMapping[cardioZone],
        songs: data.songs,
        missingSongs: data.missing_songs,
      });
    } catch (err) {
      console.error('Error creating playlist:', err);
      Alert.alert(
        'Error',
        'There was an error creating your playlist. Please try again.',
        [{ text: 'OK' }]
      );
      setError('Failed to create playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!cardioZone) {
      setError('Please select a cardio zone');
      return false;
    }

    if (!duration) {
      setError('Please enter a duration');
      return false;
    }

    const numericDuration = parseInt(duration, 10);
    if (isNaN(numericDuration) || numericDuration <= 0) {
      setError('Please enter a valid positive duration');
      return false;
    }

    if (numericDuration > 180) {
      setError('Maximum duration is 180 minutes');
      return false;
    }

    setError('');
    return true;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Playlist</Text>

          <Text style={styles.label}>Intensity:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cardioZone}
              onValueChange={(itemValue) => setCardioZone(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Choose a zone" value="" color="#FFFFFF" />
              <Picker.Item label="Zone 1 (60-84 BPM)" value="zone1" color="#FFFFFF" />
              <Picker.Item label="Zone 2 (84-108 BPM)" value="zone2" color="#FFFFFF" />
              <Picker.Item label="Zone 3 (108-132 BPM)" value="zone3" color="#FFFFFF" />
              <Picker.Item label="Zone 4 (132-156 BPM)" value="zone4" color="#FFFFFF" />
              <Picker.Item label="Zone 5 (156-180 BPM)" value="zone5" color="#FFFFFF" />
            </Picker>
          </View>

          <Text style={styles.label}>Duration (minutes):</Text>
          <TextInput
            style={[styles.input]}
            keyboardType="numeric"
            placeholder="Enter duration"
            placeholderTextColor="#888"
            value={duration}
            onChangeText={setDuration}
            maxLength={3}
            returnKeyType="done"
          />

          <TouchableOpacity 
            onPress={handleCreatePlaylist} 
            style={[
              styles.createButton,
              isLoading && styles.createButtonDisabled,
              error ? styles.inputError : null
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 30,
  },
  label: {
    color: '#B3B3B3',
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#282828',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  picker: {
    color: '#FFFFFF',
  },
  input: {
    backgroundColor: '#282828',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    backgroundColor: '#1DB95480',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
