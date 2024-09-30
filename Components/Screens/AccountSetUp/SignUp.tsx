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
  RefreshControl,
  Alert
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import * as SecureStore from 'expo-secure-store';
import Checkbox from '../Assecories/Checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import useRefreshControl from '../../../RefreshControl';
import { Ionicons } from '@expo/vector-icons';
import DateOfBirthInput from './DatePicker';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [referrer, setReferrer] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCheckedNewsletter, setIsCheckedNewsletter] = useState(false);
  const [isCheckedTerms1, setIsCheckedTerms1] = useState(false);
  const [isCheckedTerms2, setIsCheckedTerms2] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const resetFields = () => {
    setFirstName('');
    setLastName('');
    setReferrer('');
    setEmail('');
    setPassword('');
    setPhone('');
    setDateOfBirth(new Date());
    setIsCheckedNewsletter(false);
    setIsCheckedTerms1(false);
    setIsCheckedTerms2(false);
  };

  const { refreshing, onRefresh } = useRefreshControl(resetFields);

  const navigation = useNavigation<ScreenNavigationProp<'EmailVerif' | 'SignIn'>>();

  useEffect(() => {
    // Enable the button only if the first two terms checkboxes are checked
    setIsButtonEnabled(isCheckedTerms1 && isCheckedTerms2);
  }, [isCheckedTerms1, isCheckedTerms2]);

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void
  ) => (
    <View>
      <View
        style={[
          placeholder === "Password" && !isPasswordValid
            ? styles.invalidInput
            : {},
        ]}
      >
        <AnimatedInput
          placeholder={placeholder}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (placeholder === "Password") {
              const isValid = validatePassword(text);
              setIsPasswordValid(isValid);
            }
          }}
        />
      </View>
      {placeholder === "Password" && !isPasswordValid && (
        <Text style={styles.errorText}>
          Password must contain at least 8 characters, including uppercase,
          lowercase, number, and special character.
        </Text>
      )}
    </View>
  );  

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDifference = today.getMonth() - dateOfBirth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignUp = async () => {
    const age = calculateAge(dateOfBirth);
    if (age <= 16) {
      Alert.alert('Age Restriction', 'The new user is too young to create a financial account.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert('Invalid Password', 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.');
      return;
    }

    setLoading(true);
    try {
      console.log(firstName, lastName, email, password, dateOfBirth);
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
          phone,
          birthDate: dateOfBirth.toISOString().split('T')[0]
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        await SecureStore.setItemAsync('userID', data.data.user_Id);
        Alert.alert('Signup Successful');
        await SecureStore.setItemAsync('email', email);
        navigation.navigate('EmailVerif');
      } else {
        Alert.alert('Signup Failed:', data.message || 'Unknown Error');
      }
    } catch (error) {
      console.error('Signup Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
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
                <View style={styles.contentContainer}>
                {/* <Text style={[styles.title, {marginLeft: "-75%", marginTop: 15}]}>Date Of Birth</Text> */}
                <DateOfBirthInput
                  dateOfBirth={dateOfBirth}
                  setShowDatePicker={setShowDatePicker}
                  showDatePicker={showDatePicker}
                  handleDateChange={handleDateChange}
                />
                  <Text style={[styles.title, {marginLeft: "-83%"}]}>Optional</Text>
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
                  <Text>Please Note: Two boxes above must be checked to move forward</Text>

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
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && <SpinnerOverlay />}
    </>
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
    fontSize: 15,
    textAlign: "left",
    marginBottom: 9
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
  },
  inputContainer: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    justifyContent: 'center',
    marginTop: 2
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'center',
  },
});

export default SignUp;
