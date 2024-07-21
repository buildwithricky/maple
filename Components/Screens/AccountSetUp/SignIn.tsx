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
  ActivityIndicator,
  BackHandler
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import AnimatedInput from '../Assecories/AnimatedInput';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'Reset' | 'Returning' | 'SignUp' | 'EmailVerif' | 'CreatePin'>>();

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
        navigation.navigate('Homepage');
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
      console.log('Response data:', data);  // Log the response data

      setLoading(false);
      if (response.ok) {
        await SecureStore.setItemAsync('firstName', data.data.firstName);
        await SecureStore.setItemAsync('lastName', data.data.lastname);
        await SecureStore.setItemAsync('email', data.data.mail.email);
        await SecureStore.setItemAsync('token', data.data.token);
        await SecureStore.setItemAsync('id', data.data._id);
        console.log('User ID:', data.data._id);  // Log the user ID
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
      } else if (data.success === 'OTP has been sent to your email address. Please check your email.') {
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
      } else {
        console.log('Login failed:', data.message);  // Log the error message
        Alert.alert('Login failed', data.message || 'Unknown Error');
      }
    } catch (error) {
      setLoading(false);
      console.log('Login error:', error);  // Log the error details
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
              <Text style={styles.title}>Welcome Back: Sign in</Text>
              <Text style={styles.subtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>

            <AnimatedInput
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
            />

            <AnimatedInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              // secureTextEntry
            />

            <Text style={styles.mainText}>
              Forgotten Password?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('Reset')}>
                <Text style={styles.linkText}>Reset Now</Text>
              </TouchableOpacity>
            </Text>

            <View style={styles.buttonContainer}>
              <CustomButton
                width={"100%"}
                gradientColors={['#ee0979', '#ff6a00']}
                title="Continue"
                onPress={handleLogin}
              />
            </View>

            <Text style={styles.mainText}>
              Don't have an account?{' '}
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.linkText}>Register Now</Text>
              </TouchableOpacity>
            </Text>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ff6a00" />
              </View>
            )}
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
    fontSize: 13,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%"
  },
});

export default SignIn;
