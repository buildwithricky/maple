import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import CustomButton from '../Assecories/CustomButton';
import { BlackHole01Icon } from '@hugeicons/react-native-pro';

export default function New_1() {
  const navigation = useNavigation();
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [showBankOptions, setShowBankOptions] = useState(false);

  const [accountNumber, setAccountNumber] = useState('');
  const [bank, setBank] = useState('');
  const [sortCode, setSortCode] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [iban, setIban] = useState('');
  const [bankAddress, setBankAddress] = useState('');
  const [narration, setNarration] = useState('');

  const banks = ['Bank A', 'Bank B'];

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyOptions(false);
  };

  const handleBankSelect = (selectedBank) => {
    setBank(selectedBank);
    setShowBankOptions(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Send Funds</Text>
          </View>
          <View style={styles.line} />

          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={styles.amountContainer}>
                <Text style={styles.amountText}>
                  <Text style={{ color: 'grey' }}>$</Text> 5,000
                </Text>
                <TouchableOpacity
                  style={styles.currencySelector}
                  onPress={() => setShowCurrencyOptions(!showCurrencyOptions)}
                >
                  <Image
                    source={require('../../../assets/MappleApp/canada.png')}
                    style={styles.flagImage}
                  />
                  <Text style={styles.currencyText}>{selectedCurrency}</Text>
                  <Ionicons name="caret-down" size={16} color="grey" />
                </TouchableOpacity>
              </View>
              {showCurrencyOptions && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleCurrencySelect('CAD')}
                  >
                    <Image source={require('../../../assets/MappleApp/canada.png')} style={styles.flagImage} />
                    <Text style={styles.optionText}>CAD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleCurrencySelect('NIG')}
                  >
                    <Image source={require('../../../assets/MappleApp/Nigeria.png')} style={styles.flagImage} />
                    <Text style={styles.optionText}>NIG</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.walletContainer}>
              <View style={styles.walletInfo}>
                <Ionicons name="wallet" size={24} color="#0E314C" />
                <Text style={styles.walletText}>Wallet Bal: </Text>
              </View>
              <Text style={styles.walletAmount}>$30,000.56</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.bankDropdown}
              onPress={() => setShowBankOptions(!showBankOptions)}
            >
              <View style={styles.selectInput}>
                <Text style={styles.selectText}>{bank || "Bank"}</Text>
                <Ionicons name="caret-down" size={24} color="grey" style={styles.dropdownIcon} />
              </View>
            </TouchableOpacity>
            {showBankOptions && (
              <View style={[styles.optionsContainer, styles.bankOptionsContainer]}>
                {banks.map((bankName, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.bankOption}
                    onPress={() => handleBankSelect(bankName)}
                  >
                    <Text style={styles.bankOptionText}>{bankName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Sort Code"
              value={sortCode}
              onChangeText={setSortCode}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Swift Code"
              value={swiftCode}
              onChangeText={setSwiftCode}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="IBAN"
              value={iban}
              onChangeText={setIban}
              keyboardType="number-pad"
              returnKeyType="done"
            />
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Bank Address"
              value={bankAddress}
              onChangeText={setBankAddress}
            />
          </View>

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Narration (Optional)"
              value={narration}
              onChangeText={setNarration}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={() => navigation.navigate('New_2')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 15,
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
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1,
  },
  bankOptionsContainer: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
  },
  bankOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: 'BlackHole01Ic',
    borderRadius: 14,
  },
  bankOptionText: {
    fontSize: 16,
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
    marginBottom: 10,
    zIndex: 0,
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
  bankDropdown: {
    width: '100%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    zIndex: 1,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff3d',
    borderRadius: 10,
    padding: 10,
    paddingVertical: 5,
    width: '100%',
  },
  selectText: {
    color: '#0E314C',
  },
  dropdownIcon: {
    position: 'absolute',
    right: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
});

