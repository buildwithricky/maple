import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import * as SecureStore from 'expo-secure-store';
import { ScreenNavigationProp } from '../../../navigation';

export default function Exchange_2() {
  const [summaryData, setSummaryData] = useState([
    { label: 'Currency Pair', value: '' },
    { label: 'Amount Tendered', value: '' },
    { label: 'Amount to Receive', value: '' },
    { label: 'Exchange Rate', value: '' },
  ]);

  const navigation = useNavigation<ScreenNavigationProp<'Exchange_3'>>();

  useEffect(() => {
    // Fetch data from SecureStore and calculate exchange details
    async function calculateExchange() {
      const selectedCurrency = await SecureStore.getItemAsync('fromCurrency');
      const beneficiaryCurrency = await SecureStore.getItemAsync('toCurrency');
      const cadAmount = await SecureStore.getItemAsync('fromAmount');
      const ngnAmount = await SecureStore.getItemAsync('toAmount');
      const cadToNgnRate = await SecureStore.getItemAsync('cadToNgnRate');
      const ngnToCadRate = await SecureStore.getItemAsync('ngnToCadRate');

      let exchangeRate = '';
      let fromAmount = '';
      let toAmount = '';
      let currencyPair = '';

      if (selectedCurrency === 'NGN' && beneficiaryCurrency === 'CAD') {
        exchangeRate = `1 NGN = CAD ${ngnToCadRate}`;
        currencyPair = 'NGN --> CAD';
        fromAmount = `₦${ngnAmount}`;
        toAmount = `$${cadAmount}`;
      } else if (selectedCurrency === 'CAD' && beneficiaryCurrency === 'NGN') {
        exchangeRate = `1 CAD = ₦${cadToNgnRate}`;
        currencyPair = 'CAD --> NGN';
        fromAmount = `$${cadAmount}`;
        toAmount = `₦${ngnAmount}`;
      }

      // Update the summary data with the calculated values
      setSummaryData([
        { label: 'Currency Pair', value: currencyPair },
        { label: 'Amount Tendered', value: fromAmount },
        { label: 'Amount to Receive', value: toAmount },
        { label: 'Exchange Rate', value: exchangeRate },
      ]);
    }

    calculateExchange();
  }, []);

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap Summary</Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/MappleApp/change_icon.png')} 
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
        {/* <View style={styles.row}>
          <Text style={styles.labelText}>Fee</Text>
          <Text style={styles.valueText}>$0.15</Text>
        </View> */}
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Swap"
          onPress={() => navigation.navigate('Exchange_3')}
        />
      </View>
    </SafeAreaView>
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
    padding: 25,
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
