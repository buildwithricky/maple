import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';

const summaryData = [
  { label: 'Currency Pair', value: 'CAD - NGN' },
  { label: 'Amount Tendered', value: '$10,000' },
  { label: 'Amount to Receive', value: 'N8,000,000' },
  { label: 'Exchange Rate', value: '1 CAD = N800' }
];

export default function Exchange_2() {
  const navigation = useNavigation<ScreenNavigationProp<'Exchange_3'>>();

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
        <View style={styles.row}>
          <Text style={styles.labelText}>Fee</Text>
          <Text style={styles.valueText}>$0.15</Text>
        </View>
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
