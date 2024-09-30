import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, KeyboardAvoidingView, Alert } from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import * as SecureStore from 'expo-secure-store';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import { API_URl } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../../navigation';

export default function Bene_2() {
  const navigation = useNavigation<ScreenNavigationProp<'Bene_4'>>();

  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNames();
  }, []);

  const fetchNames = async () => {
    try {
      const storedAmount = await SecureStore.getItemAsync('ngnAmount');
      const storedAccountName = await SecureStore.getItemAsync('accountName');
      const storedBankName = await SecureStore.getItemAsync('bankName');
      const storedAccountNumber = await SecureStore.getItemAsync('accountNumber');
      if (storedAmount) setAmount(storedAmount);
      if (storedAccountName) setAccountName(storedAccountName);
      if (storedBankName) setBankName(storedBankName);
      if (storedAccountNumber) setAccountNumber(storedAccountNumber);
    } catch (error) {
      console.error('Failed to fetch names from SecureStore', error);
    }
  };

  const saveBeneficiary = async () => {
    setLoading(true);
    try {
      // Validate accountName and accountNumber
      if (!accountName || !accountNumber) {
        setLoading(false);
        Alert.alert('Error', 'Account Name or Account Number is missing.');
        return;
      }
  
      const bankId = await SecureStore.getItemAsync('bankId');
      const bankCode = await SecureStore.getItemAsync('bankCode');
      const MobileVerified = await SecureStore.getItemAsync('isMobileVerified');
      const branches = await SecureStore.getItemAsync('branches');
      const token = await SecureStore.getItemAsync('token');
  
      const beneficiaryData = {
        accountNumber,
        accountName,
        type: "Bank",
        bank: {
          id: bankId,
          code: bankCode,
          name: bankName,
          isMobileVerified: MobileVerified,
          branches: branches
        }
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
  

  return (
    <>
    <SafeAreaView style={styles.loadingContainer}>
      <KeyboardAvoidingView>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../../assets/MappleApp/transfer_icon.png')} // Change the path as needed
            style={styles.image}
          />
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.row}>
            <Text style={styles.labelText}>Amount</Text>
            <Text style={[styles.valueText, { fontSize: 22 }]}>₦{amount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Account Name</Text>
            <Text style={styles.valueText}>{accountName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Bank Name</Text>
            <Text style={styles.valueText}>{bankName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Account Number</Text>
            <Text style={styles.valueText}>{accountNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Transaction Fee</Text>
            <Text style={styles.valueText}>$0.00</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            width={"70%"}
            gradientColors={['#ee0979', '#ff6a00']}
            title="Send"
            onPress={() => navigation.navigate('Bene_4')}
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
      </KeyboardAvoidingView>
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
    marginVertical: 15,
  },
  labelText: {
    color: '#0E314C',
    fontSize: 14,
    fontWeight: 'regular',
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'regular',
    color: '#0E314C',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 5,
  },
});
