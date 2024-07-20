import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Swap({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swap Screen</Text>
      <Text style={styles.subText}>Please complete your account verification.</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
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
