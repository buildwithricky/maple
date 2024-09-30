import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';

export default function Interac_3() {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_4'>>();
  const [cadAmount, setCadAmount] = useState('');
  const [interactEmail, setInteractEmail] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const storedCadAmount = await SecureStore.getItemAsync('cadAmount');
        const storedInteractEmail = await SecureStore.getItemAsync('interactEmail');
        const storedSelectedQuestion = await SecureStore.getItemAsync('selectedQuestion');
        const storedAnswer = await SecureStore.getItemAsync('answer');
        const storedDescription = await SecureStore.getItemAsync('description');

        if (storedCadAmount) setCadAmount(storedCadAmount);
        if (storedInteractEmail) setInteractEmail(storedInteractEmail);
        if (storedSelectedQuestion) setSelectedQuestion(storedSelectedQuestion);
        if (storedAnswer) setAnswer(storedAnswer);
        if (storedDescription) setDescription(storedDescription);
      } catch (error) {
        console.error('Error retrieving data from SecureStore:', error);
      }
    };

    fetchStoredData();
  }, []);

  const saveBeneficiary = async () => {
    setLoading(true);
    try {

      const token = await SecureStore.getItemAsync('token');
  
      const beneficiaryData = {
        type: "Interac",
        fullName: description,
        interacEmail: interactEmail
      };
  
      const response = await fetch(`${API_URl}/beneficiary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(beneficiaryData),
      });
  
      const result = await response.json();
      setLoading(false);
  
      if (response.ok) {
        Alert.alert('Success', 'Beneficiary saved successfully');
        // Navigate to the next screen or perform other actions
      } else {
        Alert.alert('Error', result.message || 'Failed to save beneficiary');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Error saving beneficiary:', error);
    }
  };

  const summaryData = [
    { label: 'Currency', value: 'CAD' },
    { label: 'Amount', value: `$${cadAmount}` },
    // { label: 'Transaction Fee', value: '$0.00' },
    { label: 'Beneficiary', value: interactEmail },
    { label: 'Security Question', value: selectedQuestion },
    { label: 'Description', value: description },
  ];

  return (
    <>
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/MappleApp/transfer_icon.png')}
          style={styles.image}
        />
      </View>

      <View style={styles.summaryContainer}>
        {summaryData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.labelText}>{item.label}</Text>
            <Text style={styles.valueText}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Send"
          onPress={() => navigation.navigate('Interac_4')}
        />
      </View>
      <View style={styles.buttonContainer}>
          <CustomButton
            width={"70%"}
            gradientColors={['#ee0979', '#ff6a00']}
            title="Save As Beneficiary"
            onPress={saveBeneficiary}
          />
        </View>
    </SafeAreaView>
    {loading && <SpinnerOverlay />}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '10%',
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    position: 'absolute',
    left: 0,
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'medium',
    marginVertical: 10
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: -50,
    marginTop: 15,
    zIndex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  summaryContainer: {
    backgroundColor: '#FAFAF9',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    paddingTop: 25,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#0000001b',
    zIndex: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  labelText: {
    color: '#0E314C',
    fontSize: 14,
    fontWeight: "regular"
  },
  valueText: {
    fontSize: 14,
    fontWeight: "regular",
    color: '#0E314C',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
});
