import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal6 from '../../../Components/Screens/Assecories/Modal/Modal6';
import { ScreenNavigationProp } from '../../../navigation';

const Device = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Device2'>>();
  const [isModalVisible, setModalVisible] = useState(true);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleVerifyAccount = () => {
    setModalVisible(false);
    navigation.navigate('Device2');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal6 
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
  }
});

export default Device;
