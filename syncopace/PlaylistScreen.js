import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

// Component for the embedded Spotify player using WebView
const SpotifyPlayer = ({ trackId }) => {
  // Build the embed URL from the track ID.
  const embedUrl = `https://open.spotify.com/embed/track/${trackId}`;

  const injectedJavaScript = `
    document.body.style.backgroundColor = 'transparent';
    true;
  `;

  return (
    <WebView
      source={{ uri: embedUrl }}
      style={styles.webview}
      injectedJavaScript={injectedJavaScript}
      scrollEnabled={false}
      bounces={false}
      mediaPlaybackRequiresUserAction={false}
    />
  );
};

export default function PlaylistScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { playlist, zone, songs, missingSongs } = route.params;
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getZoneColor = (zone) => {
    const colors = {
      '1': '#4CAF50',
      '2': '#FFC107',
      '3': '#F44336',
    };
    return colors[zone] || '#1DB954';
  };

  const getTotalDuration = () => {
    const totalMinutes = songs.reduce((acc, song) => {
      return acc + (song.duration_ms ? song.duration_ms / 1000 / 60 : 0);
    }, 0);
    return Math.round(totalMinutes);
  };

  const formatArtists = (artistsString) => {
    try {
      const artists = typeof artistsString === 'string'
          ? JSON.parse(artistsString)
          : artistsString;
      // Return first artist or join multiple if desired
      return Array.isArray(artists) ? artists.join(', ') : artistsString;
    } catch {
      return artistsString;
    }
  };

  // When a song is pressed, set it as the current song and show the player.
  const handleSongPress = (index) => {
    setIsLoading(true);
    setCurrentSongIndex(index);
    // Hide loading indicator after a short delay (or use onLoad event from WebView)
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Forward and backward controls
  const handleNextSong = () => {
    if (currentSongIndex === null || currentSongIndex >= songs.length - 1) {
      Alert.alert('Info', 'No more songs in the playlist.');
      return;
    }
    setCurrentSongIndex(currentSongIndex + 1);
  };

  const handlePrevSong = () => {
    if (currentSongIndex === null || currentSongIndex === 0) {
      Alert.alert('Info', 'This is the first song.');
      return;
    }
    setCurrentSongIndex(currentSongIndex - 1);
  };

  const renderSongItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.songItem,
        currentSongIndex === index && styles.currentSongItem,
      ]}
      onPress={() => handleSongPress(index)}
    >
      <View style={styles.songNumberContainer}>
        {currentSongIndex === index ? (
          <Ionicons name="musical-notes" size={16} color="#1DB954" />
        ) : (
          <Text style={styles.songNumber}>{index + 1}</Text>
        )}
      </View>
      <View style={styles.songInfo}>
        <Text
          style={[
            styles.songTitle,
            currentSongIndex === index && styles.currentSongText,
          ]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {formatArtists(item.artists)}
        </Text>
      </View>
      <View style={styles.songTempoContainer}>
      <Text style={styles.songTempo}>
          {Math.round(item.tempo)} BPM
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => {
    if (!playlist || !songs) {
      return (
        <View style={styles.headerContainer}>
          <Text style={styles.errorText}>Error: Playlist data is missing.</Text>
        </View>
      );
    }

    const zoneColor = getZoneColor(zone) || "#888"; // Fallback color

    return (
      <View style={styles.headerContainer}>
        {zone ? (
          <View style={[styles.zoneIndicator, { backgroundColor: zoneColor }]}>
            <Text style={styles.zoneText}>Zone {zone}</Text>
          </View>
        ) : (
          <Text style={styles.zoneText}>Zone {zone} Playlist</Text>
        )}

        <Text style={styles.playlistStats}>
          {songs.length} songs • {getTotalDuration()} minutes
        </Text>

        {missingSongs && missingSongs.length > 0 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              {missingSongs.length} song{missingSongs.length !== 1 ? 's' : ''}{' '} couldn't be found on Spotify and were excluded.
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Your Playlist</Text>
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: currentSongIndex !== null ? 150 : 20 },
        ]}
        showsVerticalScrollIndicator={false}
      />
      {/* Player controls and embedded player */}
      {currentSongIndex !== null && (
        <View style={styles.playerContainer}>
          {/* Forward/Backward Buttons */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              onPress={handlePrevSong}
              style={styles.controlButton}
            >
              <Ionicons name="play-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentSongIndex(null)}
              style={styles.controlButton}
            >
              <Ionicons name="close-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextSong}
              style={styles.controlButton}
            >
              <Ionicons name="play-forward" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          {/* Embedded Spotify Player */}
          <SpotifyPlayer trackId={songs[currentSongIndex].id} />
        </View>
      )}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingHorizontal: 20,
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
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  zoneIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
  },
  zoneText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistStats: {
    color: '#B3B3B3',
    fontSize: 14,
    marginBottom: 15,
  },
  warningContainer: {
    backgroundColor: '#423A3A',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  warningText: {
    color: '#FFB4B4',
    fontSize: 14,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  currentSongItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#1DB954',
  },
  songNumberContainer: {
    width: 30,
    alignItems: 'center',
  },
  songNumber: {
    color: '#B3B3B3',
    fontSize: 14,
  },
  songInfo: {
    flex: 1,
    marginLeft: 10,
  },
  songTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  currentSongText: {
    color: '#1DB954',
  },
  songArtist: {
    color: '#B3B3B3',
    fontSize: 14,
    marginTop: 2,
  },
  songTempoContainer: {
    backgroundColor: '#1DB95420',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  songTempo: {
    color: '#1DB954',
    fontSize: 12,
    fontWeight: '500',
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: '#282828',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  controlButton: {
    padding: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
