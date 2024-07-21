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
  Alert,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';



const Reset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const navigation = useNavigation<ScreenNavigationProp<'Reset2'>>();

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

  const handleRestPassword = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URl}/user/forgot-password-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        navigation.navigate('Reset2');
      } else {
        Alert.alert('Reset Password Failed', data.message || 'Unknown Error');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Reset Password error', (error as Error).message);
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
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
              Forgot your password? No worries! Just enter your email address below, and we'll send you a link to reset it. 
              </Text>
            </View>

            {/* Email Address Input */}
            <AnimatedInput
                placeholder="Email Address"
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            
            {/* Button */}
            <View style={styles.buttonContainer}>
              <CustomButton
                width={"100%"}
                gradientColors={['#ee0979', '#ff6a00']}
                title="Continue"
                onPress={handleRestPassword}
              />
            </View>
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
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 20,
    zIndex: 1,
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
  input: {
    height: 35,
    fontSize: 16,
    marginTop: 8,
    textAlign: 'left',
    width: '100%',
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

export default Reset;
