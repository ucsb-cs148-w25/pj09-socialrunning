import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react-native';

const PlaylistScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');

  // Mock data - will be replaced with Spotify API data later
  const mockPlaylist = [
    {
      id: 1,
      title: "Running Up That Hill",
      artist: "Kate Bush",
      duration: "4:58",
      albumArt: "https://via.placeholder.com/64"
    },
    {
      id: 2,
      title: "Eye of the Tiger",
      artist: "Survivor",
      duration: "4:05",
      albumArt: "https://via.placeholder.com/64"
    },
    {
      id: 3,
      title: "Gonna Fly Now",
      artist: "Bill Conti",
      duration: "2:45",
      albumArt: "https://via.placeholder.com/64"
    }
  ];

  const totalDuration = "11:48";

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Spotify playback control will be integrated here
  };

  const handleSkip = (direction) => {
    // Spotify skip track control will be integrated here
    console.log(`Skipping ${direction}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Running Playlist</Text>
      </View>

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{currentTime}</Text>
        <Text style={styles.timerLabel}>Current Time</Text>
      </View>

      {/* Playback Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => handleSkip('previous')}
          style={styles.controlButton}
        >
          <SkipBack color="#FFFFFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.playButton}
        >
          {isPlaying ? 
            <Pause color="#FFFFFF" size={24} /> : 
            <Play color="#FFFFFF" size={24} />
          }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSkip('next')}
          style={styles.controlButton}
        >
          <SkipForward color="#FFFFFF" size={24} />
        </TouchableOpacity>
      </View>

      {/* Playlist */}
      <ScrollView style={styles.playlist}>
        {mockPlaylist.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={styles.trackItem}
          >
            <Image
              source={{ uri: track.albumArt }}
              style={styles.albumArt}
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{track.title}</Text>
              <Text style={styles.artistName}>{track.artist}</Text>
            </View>
            <Text style={styles.trackDuration}>{track.duration}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    paddingTop: 60
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    width: '100%',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    backgroundColor: '#282828',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerLabel: {
    fontSize: 14,
    color: '#9B9B9B',
    marginTop: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  playlist: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#282828',
  },
  albumArt: {
    width: 48,
    height: 48,
    borderRadius: 4,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  artistName: {
    fontSize: 14,
    color: '#9B9B9B',
  },
  trackDuration: {
    fontSize: 14,
    color: '#9B9B9B',
    marginLeft: 8,
  },
});

export default PlaylistScreen;