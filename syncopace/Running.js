// RunningComponent.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const RunningComponent = () => {
  const [running, setRunning] = useState(false);
  const [locations, setLocations] = useState([]);
  const [region, setRegion] = useState(null);
  const [watchId, setWatchId] = useState(null);

  // Start or stop tracking when the 'running' state changes
  useEffect(() => {
    if (running) {
      // Reset any previous run data
      setLocations([]);

      // Begin watching the device's location
      const id = Geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update the map region to center on the current location
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          // Append the new coordinate to the route
          setLocations((prevLocations) => [
            ...prevLocations,
            { latitude, longitude },
          ]);
        },
        (error) => console.log(error),
        {
          enableHighAccuracy: true,
          distanceFilter: 1,       // Update for every 1 meter change (adjust as needed)
          interval: 1000,          // Update every 1000 milliseconds
          fastestInterval: 1000,
        }
      );
      setWatchId(id);
    } else {
      // Stop tracking when run is stopped
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    }

    // Cleanup the watch when the component unmounts or running state changes
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [running]);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView style={styles.map} region={region} showsUserLocation>
          {locations.length > 0 && (
            <>
              <Polyline coordinates={locations} strokeWidth={4} strokeColor="blue" />
              <Marker coordinate={locations[locations.length - 1]} />
            </>
          )}
        </MapView>
      ) : (
        // Render a default map view before the region is set
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,    // Default latitude (e.g., San Francisco)
            longitude: -122.4324,  // Default longitude
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation
        />
      )}
      <View style={styles.buttonContainer}>
        {!running ? (
          <Button title="Start Run" onPress={() => setRunning(true)} />
        ) : (
          <Button title="Stop Run" onPress={() => setRunning(false)} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 10,
    borderRadius: 5,
  },
});

export default RunningComponent;
