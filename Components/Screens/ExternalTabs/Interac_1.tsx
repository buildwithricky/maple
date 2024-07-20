import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import CustomButton from '../Assecories/CustomButton';
import BottomSheetModal8 from '../Assecories/Modal/Modal8';
import { ScreenNavigationProp } from '../../../navigation';

interface Beneficiary {
  email?: string;
  tag?: string;
}

const beneficiaries = [
  { email: 'John Doe', tag: '123-456-789' },
  { email: 'Jane Smith', tag: '987-654-321' },
  // Add more beneficiaries here
];

export default function Interac_1() {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_2'>>();
  const [showOptions, setShowOptions] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [recipientTag, setRecipientTag] = useState('');
  const [narration, setNarration] = useState('');

  const handleSelectBeneficiary = (beneficiary: Beneficiary) => {
    setEmail(beneficiary.email || '');
    setRecipientTag(beneficiary.tag || '');
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            <Text style={{ fontSize: 16, color: "#A4A6AA" }}>$</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              placeholder="5,000"
            />
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowOptions(!showOptions)}
            >
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
          <Text style={styles.walletAmount}>$30,000.56</Text>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text onPress={() => setModalVisible(true)} style={styles.input}>
          Select Beneficiary
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Interac Email"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="Enter Recipient's Tag"
          value={recipientTag}
          onChangeText={setRecipientTag}
        />
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
          onPress={() => navigation.navigate('Interac_2')}
        />
      </View>

      <BottomSheetModal8
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        beneficiaries={beneficiaries}
        onSelectBeneficiary={handleSelectBeneficiary}
        isInterac={true} // Specify true for email/tag based data
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
  amountInput: {
    fontSize: 18,
    color: 'grey',
    marginRight: 30,
    padding: 5,
    width: "60%"
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
  },
});
