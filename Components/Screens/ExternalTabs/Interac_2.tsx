import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AnimatedInput from '../Assecories/AnimatedInput';
import CustomButton from '../Assecories/CustomButton';

export default function Interac_2() {
  const navigation = useNavigation();
  const [selectedCurrency, setSelectedCurrency] = useState('CAD');
  const [showOptions, setShowOptions] = useState(false);

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setShowOptions(false);
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>

      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              <Text style={{ color: 'grey' }}>$</Text> 5,000
            </Text>
            <TouchableOpacity
              style={styles.currencySelector}
              onPress={() => setShowOptions(!showOptions)}
            >
              <Image
                source={require('../../../assets/MappleApp/canada.png')}
                style={styles.flagImage}
              />
              <Text style={styles.currencyText}>{selectedCurrency}</Text>
              <Ionicons name="caret-down" size={16} color="grey" />
            </TouchableOpacity>
          </View>
          {showOptions && (
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

      <View style={styles.secondOuterContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountText}>
              <Text style={{ color: 'grey' }}>$</Text> Ibekwe
            </Text>
          </View>
        </View>
        <View style={styles.walletContainer}>
          <View style={styles.walletInfo}>
            <FontAwesome name="percent" size={16} color="#0E314C" />
            <Text style={styles.walletText}>Transaction Fee: </Text>
          </View>
          <Text style={styles.walletAmount}>$0.00</Text>
        </View>
        <Text style={styles.interacEmailText}>Interac Email</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={() => navigation.navigate('Interac_3')}
        />
      </View>
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
    marginBottom: 25,
    paddingTop: 1,
  },
  secondOuterContainer: {
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    paddingBottom: 20,
    paddingTop: 1,
    marginBottom: 13,
    position: 'relative',
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
  interacEmailText: {
    position: 'absolute',
    top: -10,
    left: 15,
    paddingHorizontal: 5,
    color: '#0E314C',
    fontSize: 16,
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
});
