import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal4 from '../../../Components/Screens/Assecories/Modal/Modal4';

const RateAlerts = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(true);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleVerifyAccount = () => {
    setModalVisible(false);
    navigation.navigate('settings');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Our Rates</Text>
        <View style={{ width: 24 }} /> 
      </View>
      <Modal4 
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onVerifyAccount={handleVerifyAccount}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backArrow: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
  },
});

export default RateAlerts;
