import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_URl } from '@env';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';
import CustomButton from '../../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';

const BVNverif = () => {
  const [bvn, setBVN] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const navigation = useNavigation<ScreenNavigationProp<'BVNverif2'>>();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await SecureStore.getItemAsync('userID');
      if (storedUserId) {
        setUserId(storedUserId);
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    };

    fetchUserId();
  }, []);

  const handleBVNChange = (value: string) => {
    // Ensure the BVN is numeric and exactly 11 characters
    if (/^\d{0,11}$/.test(value)) {
      setBVN(value);
      setError(value.length !== 11); // Show error if BVN is not exactly 11 characters
    }
  };

  const verifyBVN = async () => {
    if (bvn.length !== 11 || !userId) {
      setError(true);
      return;
    }

    setLoading(true);
    const url = `${API_URl}/user/send-bvn-otp`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bvn,
          userId,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        await SecureStore.setItemAsync('BVN', bvn);
        Alert.alert('Success', 'BVN verification successful.');
        sendNotification(data.data.phoneNo, data.data.OTP);
        // Navigate to the next screen if verification is successful
        navigation.navigate('BVNverif3');
      } else {
        Alert.alert('Error', data.message || 'BVN verification failed.');
      }
    } catch (error) {
      console.error('BVN Verification Error:', error);
      setLoading(false);
      Alert.alert('Error', 'An error occurred during BVN verification.');
    }
  };

  const sendNotification = async (phoneNo: string, OTP: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "BVN Verification OTP Sent",
        body: `Your OTP has been sent to this phone number: ${phoneNo}`,
      },
      trigger: null,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Verify Bank Verification Number (BVN)</Text>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            value={bvn}
            onChangeText={handleBVNChange}
            keyboardType="numeric"
            maxLength={11}
            placeholder="Enter your BVN"
          />
          {error && <Text style={styles.errorMessage}>BVN must be exactly 11 digits.</Text>}
          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Verify BVN"
              onPress={verifyBVN}
              disabled={bvn.length !== 11} // Pass the disabled state to CustomButton
            />
          </View>
        </View>
      </ScrollView>
      {loading && <SpinnerOverlay />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  inputError: {
    borderColor: '#F37A74',
  },
  errorMessage: {
    color: '#EE4139',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 13,
  },
});

export default BVNverif;
