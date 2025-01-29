import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Picker, ScrollView } from 'react-native';

export default function CreatePlaylistScreen({ onBack }) {
  const [cardioZone, setCardioZone] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [playlistData, setPlaylistData] = useState(null);

  const handleCreatePlaylist = () => {
    if (!validateForm()) {
      return;
    }
  
    const playlistData = {
      genre: genre,
      duration: parseInt(duration, 10),
      cardioZone: cardioZone,
    };
  
    // Show the playlist data as an alert
    alert(JSON.stringify(playlistData, null, 2));
  };
  
  const validateForm = () => {
    if (!cardioZone || !genre || !duration) {
      setError('Please fill in all fields with valid data');
      return false;
    }
  
    const numericDuration = parseInt(duration, 10);     // Round down for floats
    if (!Number.isInteger(numericDuration) || numericDuration <= 0) {
      setError('Please enter a valid positive duration.');
      return false;
    }
  
    setError(''); 
    return true;
  };

  // Check if form is valid to enable the "Create" button
  const isFormValid = genre !== 'none' && cardioZone !== 'none' && duration !== '';

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Playlist</Text>

      {/* Cardio Zone Dropdown */}
      <Text style={styles.label}>Cardio Zone:</Text>
      <Picker
        selectedValue={cardioZone}
        onValueChange={(itemValue) => setCardioZone(itemValue)}
        style={styles.dropdown}
      >
        <Picker.Item label="Choose a zone" value="none" />
        <Picker.Item label="Warm Up: 50-60%" value="zone1" />
        <Picker.Item label="Light Jog: 60-70%" value="zone2" />
        <Picker.Item label="Power Jog: 70-80%" value="zone3" />
        <Picker.Item label="Steady Pace: 80-90%" value="zone4" />
        <Picker.Item label="Sprint Zone: 90-100%" value="zone5" />
      </Picker>

      {/* Genre Dropdown */}
      <Text style={styles.label}>Genre:</Text>
      <Picker
        selectedValue={genre}
        onValueChange={(itemValue) => setGenre(itemValue)}
        style={styles.dropdown}
      >
        <Picker.Item label="Choose a genre" value="none" />
        <Picker.Item label="Pop" value="pop" />
        <Picker.Item label="Hip-Hop" value="hip-hop" />
        <Picker.Item label="Rap" value="rap" />
        <Picker.Item label="Rock" value="rock" />
        <Picker.Item label="Dubstep" value="dubstep" />
        <Picker.Item label="Melodic Bass" value="melodic-bass" />
        <Picker.Item label="House" value="house" />
      </Picker>

      {/* Duration Input */}
      <Text style={styles.label}>Duration (minutes):</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        keyboardType="numeric"
        placeholder="Enter duration"
        value={duration}
        onChangeText={setDuration}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleCreatePlaylist}
        style={[styles.createButton, !isFormValid ? styles.disabledButton : null]}
        disabled={!isFormValid}
      >
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>

      {/* Display Playlist JSON if available */}
      {playlistData && (
        <ScrollView style={styles.playlistDataContainer}>
          <Text style={styles.playlistDataText}>
            {JSON.stringify(playlistData, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  dropdown: {
    backgroundColor: '#282828',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#282828',
    color: '#FFFFFF',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
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
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  playlistDataContainer: {
    marginTop: 20,
    backgroundColor: '#282828',
    padding: 10,
    borderRadius: 4,
  },
  playlistDataText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});
