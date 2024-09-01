import React, { useState, useEffect } from 'react';
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
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { ScreenNavigationProp } from '../../../../navigation';
import CustomButton from '../../Assecories/CustomButton';
import DialPad from '../../AccountSetUp/SignUp/DialPad';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';
import { API_URl } from '@env';

const Transfer4 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_5'>>();
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    amount: number;
    mail: string;
    currency: string;
    description: string;
    fee: number;
    transactionPin: string;
  }>({
    amount: 0,
    mail: '',
    currency: '',
    description: '',
    fee: 0,
    transactionPin: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCurrency = await SecureStore.getItemAsync('currency');
        const storedAmount = await SecureStore.getItemAsync('amount');
        const storedDescription = await SecureStore.getItemAsync('description');
        const storedEmail = await SecureStore.getItemAsync('transactionMail');

        if (storedCurrency) transactionData.currency = storedCurrency;
        if (storedAmount) transactionData.amount = Number(storedAmount); // Convert to number
        if (storedDescription) transactionData.description = storedDescription;
        if (storedEmail) transactionData.mail = storedEmail;

        setTransactionData({ ...transactionData });
      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
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

  const handleFingerprintLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      alert('This device does not have a fingerprint scanner.');
      return;
    }

    const biometricRecords = await LocalAuthentication.isEnrolledAsync();
    if (!biometricRecords) {
      alert('No fingerprints are registered. Please register a fingerprint.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync();
    if (result.success) {
      navigation.navigate('Interac_5');
    } else {
      alert('Fingerprint authentication failed. Please try again.');
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  const handleConfirmPress = async () => {
    if (isCodeComplete) {
      setLoading(true);
      transactionData.transactionPin = code.join('');
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API_URl}/wallet/w2w`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionData),
        });
        const data = await response.json();
        setLoading(false);
        if (data.success) {
          alert(data.message);
          navigation.navigate('Interac_5');
        } else {
          alert('Transfer failed. Please try again.');
          setError(true);
          Vibration.vibrate();
        }
      } catch (error) {
        setLoading(false);
        alert('An error occurred. Please try again.');
        console.error('Error during transfer:', error);
      }
    }
  };

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
                  secureTextEntry={true}  // This makes the input dots
                />
              ))}
            </View>
            {error && <Text style={styles.errorMessage}>PIN Mismatch! Try again</Text>}

            <View style={styles.buttonContainer}>
              <CustomButton
                width={163}
                gradientColors={isCodeComplete ? ['#ee0979', '#ff6a00'] : ['#CCCCCC', '#CCCCCC']}
                title="Confirm"
                onPress={handleConfirmPress}
                textStyle={isCodeComplete ? styles.buttonText : styles.buttonTextDisabled}
              />
            </View>

            <View style={styles.dialPadContainer}>
              <DialPad onPress={handleDialPadPress} fingerprintPress={handleFingerprintLogin} />
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
  title: {
    fontSize: 20,
    color: 'black',
    textAlign: 'center',
    paddingBottom: 45,
    marginTop: -7,
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
  backButton: {
    position: 'absolute',
    top: 35,
    left: 20,
    zIndex: 1,
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

export default Transfer4;
