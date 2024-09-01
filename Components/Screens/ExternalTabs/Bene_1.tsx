import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import CustomButton from '../Assecories/CustomButton';
import BottomSheetModal8 from '../Assecories/Modal/Modal8';
import BottomSheetModal9 from '../Assecories/Modal/Model9';
import { ScreenNavigationProp } from '../../../navigation';
import axios from 'axios';
import { API_URl } from '@env';
import * as SecureStore from 'expo-secure-store';

interface Beneficiary {
  accountNumber?: string;
  AccountName?: string;
  bankName?: string;
  email?: string;
  tag?: string;
}

interface Bank {
  bankName?: string;
  id?: number;
  code?: string;
  isMobileVerified?: boolean | null;
  branches?: null;
}

export default function Interac_1() {
  const navigation = useNavigation<ScreenNavigationProp<'Bene_2'>>();
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleBank, setModalVisibleBank] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [narration, setNarration] = useState('');
  const [loading, setLoading] = useState(false);
  const [ngnBalance, setNgnBalance] = useState('');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [ngnAmount, setNgnAmount] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [bankId, setBankId] = useState<number | null>(null);
  const [bankCode, setBankCode] = useState('');

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setAccountNumber(beneficiary.accountNumber || '');
    setBankName(beneficiary.bankName || '');
    setAccountName(beneficiary.AccountName || '');
  };

  // Save Choosen Bank Details
  const saveBankDetails = async (bank: Bank) => {
    try {
      if (bank.bankName) {
        await SecureStore.setItemAsync('bankName', bank.bankName);
      }
      if (bank.id !== undefined) {
        await SecureStore.setItemAsync('bankId', bank.id.toString());
      }
      if (bank.code) {
        await SecureStore.setItemAsync('bankCode', bank.code);
      }
      if (bank.isMobileVerified !== undefined) {
        await SecureStore.setItemAsync('isMobileVerified', JSON.stringify(bank.isMobileVerified));
      }
      if (bank.branches !== undefined) {
        await SecureStore.setItemAsync('branches', JSON.stringify(bank.branches));
      }
      console.log(bank.bankName, bank.id, bank.code, bank.isMobileVerified, bank.branches);
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  // Verify bank account and generate Account name
  const verifyBankAccount = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync('token');
      const currentAccountNumber = accountNumber;
      const currentBankCode = bankCode;
      
      if (token && currentAccountNumber && currentBankCode) {
        const response = await axios.post(
          `${API_URl}/beneficiary/verify-bank`,
          {
            accountNumber: currentAccountNumber,
            bank: {
              id: bankId,
              code: currentBankCode,
              name: bankName,
              isMobileVerified: null,
              branches: null,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.data.success) {
          setAccountName(response.data.data.accountName);
        } else {
          Alert.alert('Bank verification failed:', response.data.message);
        }
      }
    } catch (error) {
      console.error('Error verifying bank account:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBank = (bank: Bank) => {
    if (bank.bankName && bank.id !== undefined && bank.code) {
      setBankName(bank.bankName);
      setBankId(bank.id);
      setBankCode(bank.code);
      saveBankDetails(bank as Bank); 
      setModalVisibleBank(false);
  
      // Use setTimeout to ensure state is updated before verifying
      setTimeout(() => {
        verifyBankAccount();
      }, 0);
    } else {
      console.error('Invalid bank object:', bank);
    }
  };
  useEffect(() => {
    if (bankCode && accountNumber) {
      verifyBankAccount();
    }
  }, [bankCode, accountNumber]);

  // Save transaction Details
  const saveDetailsAndNavigate = async () => {
    try {
      await SecureStore.setItemAsync('accountNumber', accountNumber);
      await SecureStore.setItemAsync('accountName', accountName);
      await SecureStore.setItemAsync('ngnAmount', ngnAmount);
      navigation.navigate('Bene_2');
    } catch (error) {
      console.error('Error saving details:', error);
    }
  };

  // Fetch naira Account balance
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const ngn = await SecureStore.getItemAsync('walletBalance');
        if (ngn) setNgnBalance(ngn);
      } catch (error) {
        console.error('Error retrieving wallet balances:', error);
      }
    };

    fetchBalances();
  }, []);

  // Fetch beneficiary accounts
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const response = await axios.get(`${API_URl}/beneficiary/Bank`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            const fetchedBeneficiaries = response.data.data.map((bank: any) => ({
              accountNumber: bank.accountNumber,
              AccountName: bank.accountName,
              bankName: bank.bankName,
            }));
            setBeneficiaries(fetchedBeneficiaries);
          }
        }
      } catch (error) {
        console.error('Error fetching beneficiaries:', error);
      }
    };

    // Fetch all nigerian banks
    const fetchBanks = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const response = await axios.get(`${API_URl}/gateway/banks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Adjust to handle the nested data structure
          if (response.data.success && Array.isArray(response.data.data?.data)) {
            const fetchedBanks = response.data.data.data.map((bank: any) => ({
              bankName: bank.name,
              id: bank.id,
              code: bank.code,
              isMobileVerified: bank.isMobileVerified,
              branches: bank.branches,
            }));
            setBanks(fetchedBanks);
          } else {
            console.warn('Unexpected response format for banks:', response.data);
          }
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    fetchBeneficiaries();
    fetchBanks();
  }, []);

  useEffect(() => {
    setIsButtonDisabled(accountNumber.length !== 10 || !bankName || ngnAmount.length == 0);
  }, [accountNumber, bankCode, bankName, ngnAmount]);

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            <Text style={{ fontSize: 16, color: "#A4A6AA" }}>₦</Text>
            <TextInput
              style={styles.amountInput}
              value={ngnAmount}
              keyboardType="numeric"
              placeholder="5,000"
              onChangeText={(text) => {
                // Remove non-numeric characters
                const formattedText = text.replace(/[^0-9]/g, '');
                setNgnAmount(formattedText);
              }}
            />

            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowOptions(!showOptions)}
            >
              <Image
                source={require('../../../assets/MappleApp/Nigeria.png')}
                style={styles.flagImage}
              />
              <Text style={styles.currencyText}>NGN</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.walletContainer}>
          <View style={styles.walletInfo}>
            <Ionicons name="wallet" size={24} color="#0E314C" />
            <Text style={styles.walletText}>Wallet Bal: </Text>
          </View>
          <Text style={styles.walletAmount}>{ngnBalance}</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Account Number"
          value={accountNumber}
          onChangeText={(text) => {
            setAccountNumber(text); // Allow more than 10 digits
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text onPress={() => setModalVisibleBank(true)} style={styles.input}>
          {bankName ? (
            <Text style={{color: "black", fontWeight: "400", fontSize: 15}}>{bankName}</Text>
          ) : (
            "Select Bank"
          )}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <AnimatedInput
            placeholder="Account Name"
            value={accountName}
            onChangeText={setAccountName}
            editable={false} // Disable typing
          />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text onPress={() => setModalVisible(true)} style={styles.input}>
          Select Beneficiary
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Narration"
          value={narration}
          onChangeText={setNarration}
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={saveDetailsAndNavigate}
          disabled={isButtonDisabled} // Disable button based on state
        />
      </View>
      <BottomSheetModal8
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        beneficiaries={beneficiaries}
        onSelectBeneficiary={handleSelectBeneficiary}
        isInterac={false} // Specify false for account number based data
      />

      <BottomSheetModal9
        isVisible={isModalVisibleBank}
        onClose={() => setModalVisibleBank(false)}
        beneficiaries={banks} // Pass the banks list
        onSelectBeneficiary={handleSelectBank}
        isInterac={false} // Specify false for account number based data
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '8%',
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
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: '#00000032',
    marginBottom: 20,
  },
  outerContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    marginBottom: 13,
    paddingTop: 1,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 18,
    color: '#0E314C',
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff3d',
    borderRadius: 10,
    padding: 10,
    paddingVertical: 5,
  },
  flagImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  currencyText: {
    color: '#0E314C',
    marginRight: 5,
  },
  optionsContainer: {
    position: 'absolute',
    right: 0,
    top: 40,
    backgroundColor: '#f1f1f1ff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  optionText: {
    marginLeft: 10,
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
  inputContainer: {
    alignItems: 'center',
    marginBottom: 3,
  },
  textInput: {
    height: 40,
    color: '#0E314C',
  },
  placeholder: {
    position: 'absolute',
    left: 15,
    color: '#0E314C',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
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
  amountInput: {
    fontSize: 18,
    color: 'black',
    marginRight: 30,
    padding: 5,
    width: "60%"
  },
});
