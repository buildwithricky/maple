import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';
import DialPad from './DialPad';
import * as SecureStore from 'expo-secure-store';
import { ScreenNavigationProp } from '../../../../navigation';
import { API_URl } from '@env';

// Define the props interface
interface SignInProps {
    setIsUserLoggedIn: (value: boolean) => void;
  }

const TwoFA: React.FC<SignInProps> = ({ setIsUserLoggedIn }) => {
    const navigation = useNavigation<ScreenNavigationProp<'Homepage'>>();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
  
    const handleResendCode = () => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 3000); // Show refreshing gif for 3 seconds
    };
  
    const handleInputChange = (index: number, value: string) => {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
  
      // Check if all code inputs are filled
      if (newCode.every(digit => digit !== '')) {
        setLoading(true);
        verifyEmail(newCode.join(''));
      } else {
        setError(false); // Reset error state if not all inputs are filled
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
  
    const verifyEmail = async (otp: string) => {
      const url = `${API_URl}/user/verify2FA`;
      console.log(`Making request to: ${url}`);
      console.log('Sending OTP:', otp);  // Log the OTP being sent to the backend
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ otp }),
        });
    
        // Log response status and headers
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
    
        const data = await response.json();
        console.log('Response data:', data);
        
        setLoading(false);
    
        if (response.ok && data.success) {
            await SecureStore.setItemAsync('firstName', data.data.firstName);
            await SecureStore.setItemAsync('lastName', data.data.lastname);
            await SecureStore.setItemAsync('email', data.data.mail.email);
            await SecureStore.setItemAsync('token', data.data.token);
            await SecureStore.setItemAsync('id', data.data._id);
            await SecureStore.setItemAsync('accountVerif', data.data.isVerified.toString());
            console.log('Two Factor Authentication Successful');
            setIsUserLoggedIn(true);
            navigation.navigate('Homepage');
        } else {
            console.log('Verification Failed:', data.message || 'Unknown Error');
            setError(true);
            Vibration.vibrate();
        }
      } catch (error) {
            console.error('Verification Error:', error);
            setLoading(false);
            setError(true);
            Vibration.vibrate();
        }
    };
    
  
    const [email, setEmail] = useState('');
  
    useEffect(() => {
      const getEmail = async () => {
        try {
          const email = await SecureStore.getItemAsync('email');
          if (email !== null) {
            setEmail(email);
          }
        } catch (error) {
          console.error('Failed to load email.', error);
        }
      };
  
      getEmail();
    }, []);
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.loadingContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.title_two}>Verify Email Address For Two Factor Authentication</Text>
              <Text style={styles.subtitle}>Enter the 6 digit code sent to</Text>
              <Text style={styles.subtitle_two}>{email}</Text>
              <TouchableOpacity style={styles.editEmailContainer} onPress={() => navigation.goBack()}>
                <FontAwesome name="edit" size={16} color="green" />
                <Text style={styles.editEmailText}>Edit Email Address</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputCodeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[styles.inputCode, error && styles.inputCodeError]}
                  value={digit}
                  onChangeText={(value) => handleInputChange(index, value)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
            {error && <Text style={styles.errorMessage}>Invalid OTP, Please Retry</Text>}
            
            <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
              {refreshing ? (
                <ActivityIndicator size="small" color="green" />
              ) : (
                <>
                  <Text style={styles.resendText}>Resend Code</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1C202B" />
                </>
              )}
            </TouchableOpacity>
            
            <View style={styles.dialPadContainer}>
              <DialPad onPress={handleDialPadPress} fingerprintPress={undefined} />
              {loading && <SpinnerOverlay />}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  export default TwoFA
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 15,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      marginTop: '5%',
      width: '100%',
    },
    contentContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    title_two: {
      fontSize: 23,
      textAlign: 'center',
      paddingBottom: 12,
    },
    subtitle: {
      fontSize: 15,
      color: 'grey',
      textAlign: 'center',
    },
    subtitle_two: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 10,
    },
    editEmailContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    editEmailText: {
      fontSize: 14,
      color: 'green',
      marginLeft: 5,
    },
    inputCodeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      marginBottom: 20,
      marginVertical: 25,
    },
    inputCode: {
      width: 45,
      height: 45,
      borderWidth: 1,
      borderColor: '#CCCCCC',
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 18,
      marginHorizontal: 5,
    },
    inputCodeError: {
      borderColor: '#F37A74',
    },
    errorMessage: {
      color: '#EE4139',
      marginBottom: 20,
    },
    resendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: "10%"
    },
    resendText: {
      fontSize: 14,
      color: '#1C202B',
      marginRight: 5,
      fontWeight: 'bold',
    },
    dialPadContainer: {
      marginTop: 20,
      position: 'relative',
    },
  });