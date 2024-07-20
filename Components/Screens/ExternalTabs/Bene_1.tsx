import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import CustomButton from '../Assecories/CustomButton';
import BottomSheetModal8 from '../Assecories/Modal/Modal8';
import { ScreenNavigationProp } from '../../../navigation';
import axios from 'axios';

const API_URL = 'https://maplepay-server.onrender.com/api';

interface Beneficiary {
  accountNumber?: string;
  AccountName?: string;
  bankName?: string;
  email?: string;
  tag?: string;
}

const beneficiaries = [
  { accountNumber: '6596682012', AccountName: 'Ufuoma Chuko Oboraruvwe', bankName: 'FCMB' },
  { accountNumber: '0987678900', AccountName: 'James Chales', bankName: 'Zenith bank' },
  { accountNumber: '0987678890', AccountName: 'Obiwan Kenobi', bankName: 'First Bank' },
  { accountNumber: '9876789990', AccountName: 'Anakin Skywalker', bankName: 'GTB' },
  { accountNumber: '7877890990', AccountName: 'Luke Skywalker', bankName: 'Opay' },
  { accountNumber: '0989876789', AccountName: 'Ashoka Tano', bankName: 'Palmpay' },
  { accountNumber: '9876789878', AccountName: 'Mace Windu', bankName: 'FCMB' },
  // Add more beneficiaries here
];

export default function Interac_1() {
  const navigation = useNavigation<ScreenNavigationProp<'Bene_2'>>();
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [narration, setNarration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setAccountNumber(beneficiary.accountNumber || ''); 
    setBankName(beneficiary.bankName || ''); 
    setAccountName(beneficiary.AccountName || ''); 
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/interac-1`, {
        accountNumber,
        bankName,
        accountName,
        narration,
      });
      console.log(response.data);
      navigation.navigate('Bene_2');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            <Text style={{ fontSize: 16, color: "#A4A6AA" }}>$</Text>
              <TextInput
                style={styles.amountInput}
                // value={beneficiaryCurrency === 'CAD' ? cadAmount : ngnAmount}
                keyboardType="numeric"
                placeholder="5,000"
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
          <Text style={styles.walletAmount}>N300,000.56</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Account Number"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Bank Name"
          value={bankName}
          onChangeText={setBankName}
        />
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Account Name"
          value={accountName}
          onChangeText={setAccountName}
        />
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
          onPress={() => navigation.navigate('Bene_2')}
        />
      </View>

      <BottomSheetModal8
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        beneficiaries={beneficiaries}
        onSelectBeneficiary={handleSelectBeneficiary}
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
    color: 'grey',
    marginRight: 30,
    padding: 5,
    width: "60%"
  },
});
