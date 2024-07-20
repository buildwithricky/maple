import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';


const summaryData = [
  { label: 'Currency', value: 'CAD' },
  { label: 'Amount', value: '$10,000' },
  { label: 'Transaction Fee', value: '$0.00' },
  { label: 'Beneficiary', value: 'Adaeze Ibekwe' }
];

export default function Interac_3() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/MappleApp/transfer_icon.png')} // Change the path as needed
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
