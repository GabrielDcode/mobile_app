import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [acceleration, setAcceleration] = useState('');
  const [braking, setBraking] = useState('');
  const [turn, setTurn] = useState('');
  interface Result {
    driverId: string;
    acceleration: number;
    braking: number;
    turn: number;
    isFlagged: boolean;
    timestamp: string;
    sustainabilityScore: number;
  }

  const [result, setResult] = useState<Result | null>(null);

  const handleSubmit = async () => {
    // Validate input
    if (!acceleration || !braking || !turn) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const payload = {
      acceleration: parseFloat(acceleration),
      braking: parseFloat(braking),
      turn: parseFloat(turn),
      driverId: Math.floor(100000000 + Math.random() * 900000000).toString(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:3000/monitor-behavior', payload);
      setResult(response.data as Result);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send data to the server');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driving Behavior Monitor</Text>

      <TextInput
        style={styles.input}
        placeholder="Acceleration"
        keyboardType="numeric"
        value={acceleration}
        onChangeText={setAcceleration}
      />
      <TextInput
        style={styles.input}
        placeholder="Braking"
        keyboardType="numeric"
        value={braking}
        onChangeText={setBraking}
      />
      <TextInput
        style={styles.input}
        placeholder="Turn"
        keyboardType="numeric"
        value={turn}
        onChangeText={setTurn}
      />

      <Button title="Submit" onPress={handleSubmit} />

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Driving Event Data:</Text>
          <Text>driverId: {result.driverId}</Text>
          <Text>Acceleration: {result.acceleration}</Text>
          <Text>Braking: {result.braking}</Text>
          <Text>Turn: {result.turn}</Text>
          <Text>Is Flagged: {result.isFlagged ? 'Yes' : 'No'}</Text>
          <Text>timestamp: {result.timestamp}</Text>
          <Text>Sustainability Score: {result.sustainabilityScore}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
