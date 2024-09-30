import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DialPad from '../AccountSetUp/SignUp/DialPad';
import CustomButton from '../../Screens/Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { API_URl } from '@env';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import { decrypt } from '../../../utils/Encryp';

const Exchange_3 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'CreatePin3' | 'Exchange_4'>>();
  const [code, setCode] = useState(['', '', '', '']);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [biometricType, setBiometricType] = useState<'none' | 'fingerprint' | 'faceId'>('none');

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setIsCodeCorrect(newCode.every(digit => digit !== ''));
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

  const handleContinue = async (pin?: string) => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      const selectedCurrency = await SecureStore.getItemAsync('fromCurrency');
      const beneficiaryCurrency = await SecureStore.getItemAsync('toCurrency');
      const cadAmount = await SecureStore.getItemAsync('fromAmount');
      const ngnAmount = await SecureStore.getItemAsync('toAmount');
      const cadToNgnRate = await SecureStore.getItemAsync('cadToNgnRate');
      const ngnToCadRate = await SecureStore.getItemAsync('ngnToCadRate');

      let amount = 0;
      let rate = 0;
      let currency = '';

      if (selectedCurrency === 'NGN' && beneficiaryCurrency === 'CAD') {
        amount = parseInt(ngnAmount || '0');
        rate = parseFloat(ngnToCadRate || '0');
        currency = 'NGN';
      } else if (selectedCurrency === 'CAD' && beneficiaryCurrency === 'NGN') {
        amount = parseInt(cadAmount || '0');
        rate = parseFloat(cadToNgnRate || '0');
        currency = 'CAD';
      } else {
        throw new Error('Invalid currency pair');
      }

      const response = await fetch(`${API_URl}/wallet/fundswap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          rate: Math.round(rate),
          currency: currency,
          transactionPin: pin || code.join(''),
        }),
      });

      if (response.ok) {
        console.log(amount)
        console.log(rate)
        console.log(currency)
        navigation.navigate('Exchange_4');
      } else {
        console.log(response);
        setError(true);
        Vibration.vibrate();
      }
    } catch (error) {
      console.error('Error during fund swap:', error);
      setError(true);
      Vibration.vibrate();
    } finally {
      setLoading(false);
    }
  };

  const handleAuthentication = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to confirm transaction',
        fallbackLabel: 'Use PIN',
      });
      if (result.success) {
        // Biometric authentication successful
        // Now, we need to get the stored PIN, decrypt it, and confirm it
        const encryptedPin = await SecureStore.getItemAsync('userPin');
        if (encryptedPin) {
          const decryptedPin = decrypt(encryptedPin);
          await handleContinue(decryptedPin);
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
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.loadingContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.title_two}>Enter Transaction PIN</Text>
              <Text style={styles.subtitle}>This is your unique 4 digit number.</Text>
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
                  secureTextEntry={true}
                />
              ))}
            </View>
            {error && <Text style={styles.errorMessage}>PIN Mismatch! Try again</Text>}

            <View style={styles.buttonContainer}>
              <CustomButton
                width={163}
                gradientColors={isCodeCorrect ? ['#ee0979', '#ff6a00'] : ['#CCCCCC', '#CCCCCC']}
                title="Confirm"
                onPress={() => handleContinue()}
                textStyle={isCodeCorrect ? styles.buttonText : styles.buttonTextDisabled}
              />
            </View>

            <View style={styles.dialPadContainer}>
                <DialPad
                    onPress={handleDialPadPress}
                    biometricPress={handleAuthentication}
                    biometricType={biometricType}
                />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {loading && <SpinnerOverlay />}
    </>
  );
};

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
    marginTop: '12%',
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
  buttonContainer: {
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
  },
  buttonTextDisabled: {
    color: '#999999',
  },
  errorMessage: {
    color: '#EE4139',
    marginBottom: 20,
  },
  dialPadContainer: {
    marginTop: 20,
    position: 'relative',
  },
  inputCodeError: {
    borderColor: '#F37A74',
  },
});

export default Exchange_3;