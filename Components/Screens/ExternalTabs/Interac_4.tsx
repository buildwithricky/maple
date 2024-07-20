import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DialPad from '../AccountSetUp/SignUp/DialPad';
import CustomButton from '../../Screens/Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';

const correctCode = ['1', '2', '3', '4']; // Example correct code

const Interac_4 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'CreatePin3'>>();
  const [code, setCode] = useState(['', '', '', '']);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  const handleResendCode = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  };

  const handleInputChange = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Check if all code inputs are filled
    if (newCode.every(digit => digit !== '')) {
      setLoading(true);
      // Simulate a network request
      setTimeout(() => {
        setLoading(false);
        if (newCode.join('') === correctCode.join('')) {
          setIsCodeCorrect(true); // Enable the button
        } else {
          // Set error state if code is incorrect
          setError(true);
          Vibration.vibrate();
        }
      }, 3000); // Show spinner for 3 seconds
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

  const isCodeComplete = code.every(digit => digit !== '');

  return (
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
              onPress={() => {
                if (isCodeComplete && isCodeCorrect) {
                  navigation.navigate('Interac_5');
                }
              }}
              textStyle={isCodeComplete ? styles.buttonText : styles.buttonTextDisabled}
            />
          </View>

          <View style={styles.dialPadContainer}>
            <DialPad onPress={handleDialPadPress} fingerprintPress={undefined} />
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

export default Interac_4;
