import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import AnimatedInput from '../Assecories/AnimatedInput';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

// Define the props interface
interface SignInProps {
  setIsUserLoggedIn: (value: boolean) => void;
}

const SignIn: React.FC<SignInProps> = ({ setIsUserLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to manage password visibility
  const navigation = useNavigation<ScreenNavigationProp<'Reset' | 'Returning' | 'SignUp' | 'EmailVerif' | 'CreatePin' | 'twoFA'>>();

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

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused() && navigation.canGoBack()) {
        navigation.navigate('Onboarding');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (data.message === 'Login successful') {
        await SecureStore.setItemAsync('firstName', data.data.firstName);
        await SecureStore.setItemAsync('lastName', data.data.lastname);
        await SecureStore.setItemAsync('email', data.data.mail.email);
        await SecureStore.setItemAsync('token', data.data.token);
        await SecureStore.setItemAsync('id', data.data._id);
        await SecureStore.setItemAsync('accountVerif', data.data.isVerified.toString());
        console.log(data.data._id)
        console.log(data.data.isVerified)
        console.log(data.data.token)
        setIsUserLoggedIn(true);
        navigation.navigate('Homepage');
      } else if (data.message === 'Verify your mail') {
        Alert.alert(
          'Email Verification Required',
          'Please verify your email to proceed.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('EmailVerif'),
            },
          ]
        );
      } else if (data.message === 'PIN not created. Please set up your transaction PIN.') {
        Alert.alert(
          'PIN Required',
          'PIN not created. Please set up your transaction PIN.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('CreatePin'),
            },
          ]
        );
      } else if(data.message === 'OTP has been sent to your email address. Please check your email.'){
          Alert.alert(
            '2FA Authentication Login',
            'Please verify your email to proceed.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('twoFA'),
              },
            ]
          );
        }
       else {
        Alert.alert('Login failed', data.message || 'Unknown Error');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Login error', (error as Error).message);
    }
  };

  return (
    <>
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
                <Text style={styles.title}>Welcome: Sign in</Text>
                <Text style={styles.subtitle}>
                  Thank you for joining Maple. You are almost ready to go.
                </Text>
              </View>

              <AnimatedInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
              />

              <View>
                <AnimatedInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible} // Toggle visibility here
                />
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle state
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off' : 'eye'} // Toggle between open and closed eye icons
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.mainText}>
                  Forgotten Password?{' '}
                </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                    <Text style={styles.linkText}>Reset Now</Text>
                  </TouchableOpacity>
              </View>

              <View style={styles.buttonContainer}>
                <CustomButton
                  width={"100%"}
                  gradientColors={['#ee0979', '#ff6a00']}
                  title="Continue"
                  onPress={handleLogin}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.mainText}>
                  Don't have an account?{' '}
                </Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.linkText}>Register Now</Text>
                  </TouchableOpacity>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
      {loading && <SpinnerOverlay />}
    </>
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
    color: 'red',
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
    // marginBottom: 13,
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
    fontSize: 13,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
  },
  toggleButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -12, // Adjust to center the icon vertically
    paddingRight: 10,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 20,
    alignItems: "center"
  },
});

export default SignIn;
