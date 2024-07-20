import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import axios from 'axios';

const API_URL = 'https://maplepay-server.onrender.com/api';

export default function Add({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleGoBack = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/go-back`, {
        // Add request body here if needed
      });
      console.log(response.data);
      navigation.goBack();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Screen</Text>
      <Text style={styles.subText}>Please complete your account verification.</Text>
      <Button title="Go Back" onPress={handleGoBack} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
  },
});