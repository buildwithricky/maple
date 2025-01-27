import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import DialPad from '../AccountSetUp/SignUp/DialPad';
import { ScreenNavigationProp } from '../../../navigation';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import { decrypt } from '../../../utils/Encryp';

type RootStackParamList = {
  Returning: { pinLoggedIn: boolean; setPinLoggedIn: (loggedIn: boolean) => void };
  Reset: undefined;
  SignIn: undefined;
  Homepage: undefined;
  // ... other routes
};

type ReturningScreenRouteProp = RouteProp<RootStackParamList, 'Returning'>;

const Returning = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Reset' | 'SignIn'>>();
  const [code, setCode] = useState(['', '', '', '']);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null); 
  const [biometricType, setBiometricType] = useState<'none' | 'fingerprint' | 'faceId'>('none');

  const route = useRoute<ReturningScreenRouteProp>();
  const { pinLoggedIn, setPinLoggedIn } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URl}/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setProfileImage(data.data.profileImage || null);
          setFirstName(data.data.firstName);
          setLastName(data.data.lastName);
        } else {
          console.error('Failed to fetch user data', data.message);
        }
      } catch (err) {
        console.error('An error occurred', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (newCode.every(digit => digit !== '')) {
      confirmPin(newCode.join(''));
    }
  };

  const confirmPin = async (pin: string) => {
    setLoading(true);
    setPinError(false);
    console.log(`Sending PIN: ${pin}`);
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URl}/user/confirm-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin }),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (responseData.success) {
        setPinLoggedIn(true);
        console.log(token);
        navigation.navigate('Homepage');
      } else {
        setPinError(true);
      }
    } catch (error) {
      console.error('Error confirming PIN:', error);
      setPinError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDialPadPress = (value: string) => {
    if (value === 'Del') {
      const lastNonEmptyIndex = code.map((val, index) => (val ? index : null)).filter(index => index !== null).pop();
      if (typeof lastNonEmptyIndex === 'number') {
        handleInputChange(lastNonEmptyIndex, '');
      }
    } else if (value !== '') {
      const firstEmptyIndex = code.findIndex(val => val === '');
      if (firstEmptyIndex !== -1) {
        handleInputChange(firstEmptyIndex, value);
      }
    }
  };

  const handleAuthentication = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync();
      if (result.success) {
        // Biometric authentication successful
        // Now, we need to get the stored PIN and confirm it
        const encryptedPin = await SecureStore.getItemAsync('userPin');
        if (encryptedPin) {
          const decryptedPin = decrypt(encryptedPin);
          await confirmPin(decryptedPin);
        } else {
          console.error('No stored PIN found');
          alert('An error occurred. Please try again or use your PIN.');
        }
      } else {
        console.log('Biometric authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      alert('An error occurred during authentication. Please try again.');
    }
  };


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const storedFirstName = await SecureStore.getItemAsync('firstName');
        const storedLastName = await SecureStore.getItemAsync('lastName');
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
      } catch (error) {
        console.error('Failed to fetch names from SecureStore', error);
      }
    };

    fetchNames();
  }, []);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      const biometricTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        setBiometricType('faceId');
      } else if (biometricTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        setBiometricType('fingerprint');
      }
    };

    checkBiometricSupport();
  }, []);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.contentContainer}>
            <Image
              source={profileImage ? { uri: profileImage } : require('../../../assets/MappleApp/user.png')}
              style={styles.image}
            />
            <Text style={styles.title}>
              Welcome Back 
            </Text>
              <Text style={styles.title_two}>{firstName}</Text>
            <Text style={styles.mainText}>
              Not {firstName}?{' '}
              {/* <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.linkText}>Sign Out</Text>
              </TouchableOpacity> */}
            </Text>
          </View>

          <View style={styles.inputCodeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.inputCode, pinError && { borderColor: 'red' }]}
                value={digit}
                onChangeText={() => {}}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry={true}
                editable={false}
              />
            ))}
          </View>
          {pinError && <Text style={styles.errorText}>Incorrect PIN</Text>}

          <Text style={styles.mainText}>
            Forgotten PIN?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
              <Text style={styles.linkText}>Reset Now</Text>
            </TouchableOpacity>
          </Text>

          <View style={styles.dialPadContainer}>
            <DialPad
                onPress={handleDialPadPress}
                biometricPress={handleAuthentication}
                biometricType={biometricType}
              />
            {loading && <SpinnerOverlay />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 80,
    paddingBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '15%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 2,
  },
  title_two: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    paddingBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  subtitle_two: {
    fontSize: 16,
    textAlign: 'center',
  },
  inputCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    marginVertical: 25,
  },
  inputCode: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 10,
  },
  dialPadContainer: {
    marginBottom: 10,
  },
  mainText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginVertical: 10,
  },
  linkText: {
    fontWeight: 'bold',
  },
  image: {
    width: 80,
    height: 80,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 40, // Make image circular
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -10,
  },
});

export default Returning;
