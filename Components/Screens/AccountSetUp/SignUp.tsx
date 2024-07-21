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
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import * as SecureStore from 'expo-secure-store';
import Checkbox from '../Assecories/Checkbox';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referrer, setReferrer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isCheckedNewsletter, setIsCheckedNewsletter] = useState(false);
  const [isCheckedTerms1, setIsCheckedTerms1] = useState(false);
  const [isCheckedTerms2, setIsCheckedTerms2] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<ScreenNavigationProp<'EmailVerif' | 'SignIn'>>();

  useEffect(() => {
    // Enable the button only if the first two terms checkboxes are checked
    setIsButtonEnabled(isCheckedTerms1 && isCheckedTerms2);
  }, [isCheckedTerms1, isCheckedTerms2]);

  const renderInput = (placeholder: string, value: string, onChangeText: { (value: React.SetStateAction<string>): void; (text: string): void; }) => (
    <AnimatedInput placeholder={placeholder} value={value} onChangeText={onChangeText} />
  );

  const handleSignUp = async () => {
    setLoading(true);
    try {
      console.log(firstName, lastName, email, password);
      const response = await fetch(`${API_URl}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        await SecureStore.setItemAsync('userID', data.data.user_Id);
        console.log('Signup Successful');
        await SecureStore.setItemAsync('email', email);
        navigation.navigate('EmailVerif');
      } else {
        console.log('Signup Failed:', data.message || 'Unknown Error');
      }
    } catch (error) {
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.contentContainer}>
              <Image
                source={require('../../../assets/MappleApp/logo.png')}
                style={styles.image}
              />
              <Text style={styles.title}>Get Started: Account Registration</Text>
              <Text style={styles.subtitle}>
                We are happy to have you onboard, let us know you.
              </Text>

              {renderInput("First Name", firstName, setFirstName)}
              {renderInput("Last Name", lastName, setLastName)}
              {renderInput("Email Address", email, setEmail)}
              {renderInput("Password", password, setPassword)}
              {renderInput("Phone", phone, setPhone)}
              {renderInput("Referrer", referrer, setReferrer)}

              <Checkbox
                isChecked={isCheckedTerms1}
                onPress={() => setIsCheckedTerms1(!isCheckedTerms1)}
                text="I have read and agreed to the "
              >
                <Text style={{ color: "#0047FF" }}>Terms & Conditions, Privacy and KYC Policy</Text>
              </Checkbox>

              <Checkbox
                isChecked={isCheckedTerms2}
                onPress={() => setIsCheckedTerms2(!isCheckedTerms2)}
                text="I also confirm that I am opening this account for my personal use and not for use by a third party."
              />
              <Checkbox
                isChecked={isCheckedNewsletter}
                onPress={() => setIsCheckedNewsletter(!isCheckedNewsletter)}
                text="Check this box to stay updated with similar Maple Pay products and services by email and other means."
              />

              <View style={styles.buttonContainer}>
                <CustomButton
                  width={"100%"}
                  gradientColors={['#ee0979', '#ff6a00']}
                  title="Continue"
                  onPress={handleSignUp}
                  disabled={!isButtonEnabled} // Pass the disabled state to CustomButton
                />
              </View>
              <Text style={styles.mainText}>
                Already have an account?{' '}
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={styles.linkText}>Login Here</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ff6a00" />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
  },
  mainText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  linkText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100%",
  },
});

export default SignUp;
