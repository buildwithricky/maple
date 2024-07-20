import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';

export default function New_2() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swap Summary</Text>
      </View>
      <View style={styles.line} />

      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/MappleApp/transfer_icon.png')} // Change the path as needed
          style={styles.image}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.row}>
          <Text style={styles.labelText}>Currency</Text>
          <Text style={styles.valueText}>CAD</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>Amount</Text>
          <Text style={styles.valueText}>$10,000</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>Transaction Fee</Text>
          <Text style={styles.valueText}>$0.00</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.labelText}>Beneficiary</Text>
          <Text style={styles.valueText}>1234567890 -  Bank Name</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Send"
          onPress={() => navigation.navigate('New_3')}
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
    backgroundColor: '#d1d1d157',
    borderRadius: 15,
    padding: 10,
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
    marginBottom: 10,
  },
  labelText: {
    color: '#0E314C',
  },
  valueText: {
    fontWeight: 'bold',
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
