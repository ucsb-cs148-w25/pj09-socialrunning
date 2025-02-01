import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PlaylistScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { playlist, songs, missingSongs } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const getZoneFromName = (playlistName) => {
    const zone = playlistName.match(/Zone (\d)/);
    return zone ? zone[1] : null;
  };

  const getZoneColor = (zone) => {
    const colors = {
      '1': '#4CAF50', // Green for low intensity
      '2': '#FFC107', // Yellow for medium intensity
      '3': '#F44336'  // Red for high intensity
    };
    return colors[zone] || '#1DB954'; // Default to Spotify green
  };

  const getTotalDuration = () => {
    const totalMinutes = songs.reduce((acc, song) => {
      // Convert duration_ms to minutes and sum
      return acc + (song.duration_ms ? song.duration_ms / 1000 / 60 : 0);
    }, 0);
    return Math.round(totalMinutes);
  };

  const formatArtists = (artistsString) => {
    try {
      const artists = typeof artistsString === 'string' 
        ? JSON.parse(artistsString)
        : artistsString;
      return Array.isArray(artists) ? artists[0] : artistsString;
    } catch {
      return artistsString;
    }
  };

  const renderSongItem = ({ item, index }) => (
    <View style={styles.songItem}>
      <View style={styles.songNumberContainer}>
        <Text style={styles.songNumber}>{index + 1}</Text>
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
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
    </View>
  );

  const renderHeader = () => {
    const zone = getZoneFromName(playlist.name);
    const zoneColor = getZoneColor(zone);

    return (
      <View style={styles.headerContainer}>
        <View style={[styles.zoneIndicator, { backgroundColor: zoneColor }]}>
          <Text style={styles.zoneText}>Zone {zone}</Text>
        </View>
        
        <Text style={styles.playlistStats}>
          {songs.length} songs • {getTotalDuration()} minutes
        </Text>

        {missingSongs.length > 0 && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              {missingSongs.length} song{missingSongs.length !== 1 ? 's' : ''} couldn't 
              be found on Spotify and were excluded.
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Playlist</Text>

      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});