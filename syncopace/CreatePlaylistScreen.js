import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CreatePlaylistScreen({ onBack }) {
  const [cardioZone, setCardioZone] = useState('');
  const [genre, setGenre] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');

  const handleCreatePlaylist = () => {
    if (!validateForm()) return;

    const playlistData = {
      genre,
      duration: parseInt(duration, 10),
      cardioZone,
    };

    alert(JSON.stringify(playlistData, null, 2));
  };

  const validateForm = () => {
    if (!cardioZone || !genre || !duration) {
      setError('Please fill in all fields with valid data');
      return false;
    }

    const numericDuration = parseInt(duration, 10);
    if (!Number.isInteger(numericDuration) || numericDuration <= 0) {
      setError('Please enter a valid positive duration.');
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
        keyboardDismissMode="on-drag"
      >
        <View style={styles.container}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Create Playlist</Text>

          {/* Dropdowns */}
          <Text style={styles.label}>Intensity:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cardioZone}
              onValueChange={(itemValue) => setCardioZone(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Choose a zone" value="" color="#FFFFFF" />
              <Picker.Item label="Warm Up: 50-60%" value="zone1" color="#FFFFFF" />
              <Picker.Item label="Light Jog: 60-70%" value="zone2" color="#FFFFFF" />
              <Picker.Item label="Power Jog: 70-80%" value="zone3" color="#FFFFFF" />
              <Picker.Item label="Steady Pace: 80-90%" value="zone4" color="#FFFFFF" />
              <Picker.Item label="Sprint Zone: 90-100%" value="zone5" color="#FFFFFF" />
            </Picker>
          </View>

          <Text style={styles.label}>Genre:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={genre}
              onValueChange={(itemValue) => setGenre(itemValue)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
            >
              <Picker.Item label="Choose a genre" value="" color="#FFFFFF" />
              <Picker.Item label="Pop" value="pop" color="#FFFFFF" />
              <Picker.Item label="Hip-Hop" value="hip-hop" color="#FFFFFF" />
              <Picker.Item label="Rap" value="rap" color="#FFFFFF" />
              <Picker.Item label="Rock" value="rock" color="#FFFFFF" />
              <Picker.Item label="Dubstep" value="dubstep" color="#FFFFFF" />
              <Picker.Item label="Melodic Bass" value="melodic-bass" color="#FFFFFF" />
              <Picker.Item label="House" value="house" color="#FFFFFF" />
            </Picker>
          </View>

          {/* Duration Input */}
          <Text style={styles.label}>Duration (minutes):</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            keyboardType="numeric"
            placeholder="Enter duration"
            placeholderTextColor="#888"
            value={duration}
            onChangeText={setDuration}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity onPress={handleCreatePlaylist} style={styles.createButton}>
            <Text style={styles.createButtonText}>Create</Text>
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
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
