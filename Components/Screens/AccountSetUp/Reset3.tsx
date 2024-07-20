import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import { Ionicons } from '@expo/vector-icons';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';

const Reset3 = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation<ScreenNavigationProp<'Reset4'>>();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (event) => {
        setKeyboardOffset(event.endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleConfirmPress = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URl}/user/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('Reset4');
      } else {
        setError(data.message || 'Unknown Error');
      }
    } catch (error) {
      console.error('Error:', error);
      // setError('Unknown Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.loadingContainer}>
            <View style={styles.contentContainer}>
              <Image
                source={require('../../../assets/MappleApp/logo.png')}
                style={styles.image}
              />
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                To reset your password, please enter a new password. Make sure
                your new password is strong and secure.
              </Text>
            </View>

            {/* Password Input */}
            <AnimatedInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible((prev) => !prev)}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>

            {/* Confirm Password Input */}
            <AnimatedInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry={!isConfirmPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
            >
              <Ionicons
                name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#333"
              />
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorMessage}>{error}</Text>
            )}

            {/* Button */}
            <View style={styles.buttonContainer}>
              {loading ? (
                <ActivityIndicator size="small" color="black" />
              ) : (
                <CustomButton
                  width={"100%"}
                  gradientColors={['#ee0979', '#ff6a00']}
                  title="Confirm"
                  onPress={handleConfirmPress}
                />
              )}
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15, 
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    width: '100%',
  },
  mainText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    fontWeight: 'bold',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
  image: {
    marginBottom: 25,
    marginTop: 70,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 9,
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
  },
  inputContainer: {
    width: '100%',
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
  },
  placeholder: {
    position: 'absolute',
    left: 10,
    top: -8,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    fontSize: 12,
    color: '#888',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    height: 35,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'left',
  },
  eyeIcon: {
    padding: 5,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Reset3;