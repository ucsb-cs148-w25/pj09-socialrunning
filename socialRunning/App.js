import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Ron Kibel's Hello World App</Text>
      <Text style={styles.bodyText}>This is a test</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bodyText: {
    fontSize: 16,
    color: '#333',
  },
});
