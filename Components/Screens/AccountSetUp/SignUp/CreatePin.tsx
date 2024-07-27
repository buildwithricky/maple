import React, { useState } from 'react';
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
import DialPad from './DialPad';
import CustomButton from '../../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';

const CreatePin = () => {
  const navigation = useNavigation<ScreenNavigationProp<'CreatePin3'>>();
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Check if all code inputs are filled
    if (newCode.every(digit => digit !== '')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3); // Simulate loading
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

  const isCodeComplete = code.every(digit => digit !== '');

  const handleSubmit = async () => {
    if (isCodeComplete) {
      setLoading(true);
      try {
        const pin = code.join('');
        const userId = await SecureStore.getItemAsync('userID');
        console.log(userId)
        
        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await fetch(`${API_URl}/user/create-pin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pin, userId }),
        });

        const data = await response.json();

        if (data.success) {
          navigation.navigate('CreatePin3');
        } else {
          setError(true);
          Vibration.vibrate();
        }
      } catch (error) {
        console.error('Error creating PIN:', error);
        setError(true);
        Vibration.vibrate();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.title_two}>Create Security PIN</Text>
            <Text style={styles.subtitle}>This PIN will serve as confirmation for transactions on MaplePay</Text>
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
              title="Continue"
              onPress={handleSubmit}
              textStyle={isCodeComplete ? styles.buttonText : styles.buttonTextDisabled}
            />
          </View>

          <View style={styles.dialPadContainer}>
            <DialPad onPress={handleDialPadPress} fingerprintPress={undefined} />
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

export default CreatePin;
