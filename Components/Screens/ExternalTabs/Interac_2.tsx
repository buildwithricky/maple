import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import AnimatedInput from '../Assecories/AnimatedInput';
import * as SecureStore from 'expo-secure-store';
import BottomSheetModal8 from '../Assecories/Modal/Modal8';
import axios from 'axios';
import { API_URl } from '@env';
import { Beneficiary } from '../Assecories/Modal/types';

const securityQuestions = [
  "What was your childhood nickname?",
  "What is the name of your first pet?",
  "What is your mother's maiden name?",
  "What was the make and model of your first car?"
];


export default function Interac_2() {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_3'>>();
  const [cadAmount, setCadAmount] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [interactEmail, setInteractEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [cadBalance, setCadBalance] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setInteractEmail(beneficiary.interacEmail || '');
    setDescription(beneficiary.nickname || '');
  };

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const cad = await SecureStore.getItemAsync('CadBalance');
        if (cad) setCadBalance(cad);
      } catch (error) {
        console.error('Error retrieving wallet balances:', error);
      }
    };

    fetchBalances();
    // Set up an interval to fetch balances every 5 seconds
    const intervalId = setInterval(fetchBalances, 5000);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
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

  const handleQuestionSelect = (question: string) => {
    setSelectedQuestion(question);
    setShowQuestions(false);
  };

  const saveDataToSecureStore = async () => {
    if (!cadAmount || !interactEmail || !selectedQuestion || !answer || !description) {
      Alert.alert('Error', 'Please fill all fields before continuing.');
      return;
    }

    try {
      await SecureStore.setItemAsync('cadAmount', cadAmount);
      await SecureStore.setItemAsync('interactEmail', interactEmail);
      await SecureStore.setItemAsync('selectedQuestion', selectedQuestion);
      await SecureStore.setItemAsync('answer', answer);
      await SecureStore.setItemAsync('description', description);

      console.log(cadAmount);
      console.log(interactEmail);
      console.log(selectedQuestion);
      console.log(answer);
      console.log(description);
      
      navigation.navigate('Interac_3');
    } catch (error) {
      console.error('Error saving data to SecureStore:', error);
      Alert.alert('Error', 'Failed to save data. Please try again.');
    }
  };

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const response = await axios.get(`${API_URl}/beneficiary/Interac`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setBeneficiaries(response.data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };
    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    const isValidAmount = parseFloat(cadAmount) > 0;
    const isValidEmail = /\S+@\S+\.\S+/.test(interactEmail);
    const isQuestionSelected = selectedQuestion !== '';
    const isAnswerProvided = answer.trim() !== '';
    const isDescriptionProvided = description.trim() !== '';
  
    setIsButtonDisabled(
      !isValidAmount ||
      !isValidEmail ||
      !isQuestionSelected ||
      !isAnswerProvided ||
      !isDescriptionProvided
    );
  }, [cadAmount, interactEmail, selectedQuestion, answer, description]);

  return (
    <KeyboardAvoidingView
      style={styles.loadingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardOffset}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={{ fontSize: 16, color: "#A4A6AA" }}>$</Text>
                <TextInput
                  style={styles.amountInput}
                  value={cadAmount}
                  keyboardType="numeric"
                  placeholder="5,000"
                  onChangeText={(text) => {
                    const formattedText = text.replace(/[^0-9]/g, '');
                    setCadAmount(formattedText);
                  }}
                />
                <TouchableOpacity style={styles.currencySelector}>
                  <Image
                    source={require('../../../assets/MappleApp/canada.png')}
                    style={styles.flagImage}
                  />
                  <Text style={styles.currencyText}>CAD</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.walletContainer}>
              <View style={styles.walletInfo}>
                <Ionicons name="wallet" size={24} color="#0E314C" />
                <Text style={styles.walletText}>Wallet Bal: </Text>
              </View>
              <Text style={styles.walletAmount}>{cadBalance}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Interact Email"
              value={interactEmail}
              onChangeText={setInteractEmail}
            />            
          </View>

          <View style={styles.innerContainers}>
            <TouchableOpacity onPress={() => setShowQuestions(!showQuestions)} style={styles.dropdownContainer}>
              <TextInput
                style={styles.questionInput}
                placeholder="Select a security question"
                value={selectedQuestion}
                editable={false}
              />
              <Ionicons name={showQuestions ? "chevron-up" : "chevron-down"} size={24} color="grey" />
            </TouchableOpacity>

            {showQuestions && (
              <FlatList
                data={securityQuestions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.option} onPress={() => handleQuestionSelect(item)}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <View style={styles.inputContainerss}>
            <AnimatedInput
              placeholder="Security Question Answer"
              value={answer}
              onChangeText={setAnswer}
            />  
            <AnimatedInput
              placeholder="Nick Name"
              value={description}
              onChangeText={setDescription}
            />            
          </View>

          <View style={styles.inputContainer}>
            <Text onPress={() => setModalVisible(true)} style={styles.input}>
              Select Beneficiary
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={saveDataToSecureStore}
              disabled={isButtonDisabled}
            />
          </View>

          <BottomSheetModal8
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            beneficiaries={beneficiaries}
            onSelectBeneficiary={handleSelectBeneficiary}
            isInterac={true}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginTop: '8%',
    marginHorizontal: 20,
  },
  outerContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    marginBottom: 25,
    paddingTop: 1,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  innerContainers:{
    backgroundColor: 'transparent',
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountInput: {
    fontSize: 18,
    color: '#0E314C',
    width: '68%',
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingRight: 20,
    paddingLeft: 20,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletText: {
    color: '#0E314C',
    marginLeft: 5,
  },
  walletAmount: {
    color: '#0E314C',
    fontSize: 17,
  },
  amountTextInput: {
    fontSize: 18,
    color: '#0E314C',
    width: '94%',
  },
  interacEmailText: {
    position: 'absolute',
    top: -10,
    left: 15,
    paddingHorizontal: 5,
    color: '#0E314C',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  questionInput: {
    fontSize: 16,
    color: '#0E314C',
    width: '90%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  inputContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 13,
  },
  inputContainerss: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 13,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  flagImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  currencyText: {
    fontSize: 16,
    color: '#0E314C',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    color: "#aaa"
  },
});