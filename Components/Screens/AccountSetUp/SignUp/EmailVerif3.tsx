import React, { useState } from 'react';
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
import { ScreenNavigationProp } from '../../../../navigation';
import { API_URl } from '@env'; // Importing API_URl from the .env file

const EmailVerif3 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'CreatePin'>>();
  const [code, setCode] = useState(['', '', '', '']);
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
    try {
      const response = await fetch(`${API_URl}/user/verify-email-otp`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('CreatePin');
      } else {
        setError(true);
        Vibration.vibrate();
      }
    } catch (error) {
      console.error('Verification Error:', error);
      setError(true);
      Vibration.vibrate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>1 of 2</Text>
          <Text style={styles.title_two}>Verify Email Address</Text>
          <Text style={styles.subtitle}>Enter the 4 digit OTP code sent to</Text>
          <Text style={styles.subtitle_two}>adaeze.ibekwe@malepay.ca</Text>
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
          <DialPad onPress={handleDialPadPress} biometricPress={undefined} biometricType={'none'} />
          {loading && <SpinnerOverlay />}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '12%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: 'grey',
    fontWeight: '300',
    textAlign: 'center',
    paddingBottom: 45,
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
    marginHorizontal: 10, 
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
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  dialPadContainer: {
    marginTop: 20,
    position: 'relative',
  },
});

export default EmailVerif3;
