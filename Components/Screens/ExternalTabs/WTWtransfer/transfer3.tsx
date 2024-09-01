import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';

const Transfer3 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'wtwTransfer4'>>();
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCurrency = await SecureStore.getItemAsync('currency');
        const storedAmount = await SecureStore.getItemAsync('amount');
        const storedDescription = await SecureStore.getItemAsync('description');
        const storedEmail = await SecureStore.getItemAsync('transactionMail'); // Assuming account number is stored under 'accountNumber'

        if (storedCurrency) setCurrency(storedCurrency);
        if (storedAmount) setAmount(storedAmount);
        if (storedDescription) setDescription(storedDescription);
        if (storedEmail) setEmail(storedEmail);
      } catch (error) {
        console.error('Error retrieving stored data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <KeyboardAvoidingView>
        <View style={styles.imageWrapper}>
          <Image
            source={require('../../../../assets/MappleApp/transfer_icon.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.row}>
            <Text style={styles.labelText}>Currency</Text>
            <Text style={styles.valueText}>{currency}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Amount</Text>
            <Text style={[styles.valueText, {fontSize: 22}]}>{currency === 'CAD' ? `$${amount}` : `₦${amount}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Transaction Fee</Text>
            <Text style={styles.valueText}>$0.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>Description</Text>
            <Text style={styles.valueText}>{description}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>E-Mail</Text>
            <Text style={styles.valueText}>{email}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            width={"100%"}
            gradientColors={['#ee0979', '#ff6a00']}
            title="Send"
            onPress={() => navigation.navigate('wtwTransfer4')}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Transfer3;

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
    marginVertical: 10,
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
    marginBottom: 13,
  },
});
