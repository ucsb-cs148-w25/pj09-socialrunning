import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback, 
  Alert, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function CreatePlaylistScreen() {
  const navigation = useNavigation();
  const [cardioZone, setCardioZone] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePlaylist = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    // Map zones to backend expected values
    const zoneMapping = {
      'zone1': 1,
      'zone2': 2,
      'zone3': 3
    };

    try {
      // Use your actual backend URL here
      const backendUrl = 'http://192.168.0.87:5001/get_songs';

      const response = await fetch(
        `${backendUrl}?zone=${zoneMapping[cardioZone]}&duration=${duration}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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

      // Navigate to playlist screen with the received data
      navigation.navigate('PlaylistScreen', {
        playlist: data.virtual_playlist,
        songs: data.songs,
        missingSongs: data.missing_songs
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
              <Picker.Item label="Zone 1 (60-100 BPM)" value="zone1" color="#FFFFFF" />
              <Picker.Item label="Zone 2 (100-130 BPM)" value="zone2" color="#FFFFFF" />
              <Picker.Item label="Zone 3 (130-180 BPM)" value="zone3" color="#FFFFFF" />
            </Picker>
          </View>

          <Text style={styles.label}>Duration (minutes):</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            keyboardType="numeric"
            placeholder="Enter duration"
            placeholderTextColor="#888"
            value={duration}
            onChangeText={setDuration}
            maxLength={3}
            returnKeyType="done"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            onPress={handleCreatePlaylist} 
            style={[
              styles.createButton,
              isLoading && styles.createButtonDisabled
            ]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>Create</Text>
            )}
          </TouchableOpacity>
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