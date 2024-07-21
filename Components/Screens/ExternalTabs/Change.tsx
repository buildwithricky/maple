import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';

const Change = () => {
  const navigation = useNavigation<ScreenNavigationProp<'settings'>>();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const updatePin = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }

      const response = await fetch(`${API_URl}/user/modify-pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPin,
          newPin,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
        navigation.navigate('settings');
      } else {
        Alert.alert('Error', data.message || 'Unknown error');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string, isCurrent: boolean) => {
    if (isCurrent) {
      setCurrentPin(value);
    } else {
      setNewPin(value);
    }
  };

  return (
    <>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ff6a00" />
        </View>
      )}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Change PIN</Text>
            <Text style={styles.subtitle}>Input your current and new PIN here</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputBox}
                placeholder="Current PIN"
                value={currentPin}
                onChangeText={(text) => handleInputChange(text, true)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputBox}
                placeholder="New PIN"
                value={newPin}
                onChangeText={(text) => handleInputChange(text, false)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            
            {error && <Text style={styles.errorMessage}>PIN Mismatch! Try again</Text>}
            
              <CustomButton
                width={"100%"}
                gradientColors={['#ee0979', '#ff6a00']}
                title="Confirm"
                onPress={updatePin}
                disabled={loading || currentPin.length < 4 || newPin.length < 4}
              />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 23,
    textAlign: 'center',
    paddingBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
  inputBox: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  errorMessage: {
    color: '#EE4139',
    marginBottom: 20,
  },
});

export default Change;
