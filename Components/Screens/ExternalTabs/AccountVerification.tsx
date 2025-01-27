import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Modal5 from '../../../Components/Screens/Assecories/Modal/Modal5';
import { ScreenNavigationProp } from '../../../navigation';
import axios from 'axios';
import { API_URl } from '@env';

const AccountVerification = () => {
  const navigation = useNavigation<ScreenNavigationProp<'AccountVerification2'>>();
  const [isModalVisible, setModalVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleVerifyAccount = async () => {
    setLoading(true);
    setError(null);
    setModalVisible(false);
    try {
      const response = await axios.post(`${API_URl}/verify-account`, {
        // Add request body here if needed
      });
      console.log(response.data);
      navigation.navigate('AccountVerification2');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Modal5 
        isVisible={isModalVisible}
        onClose={handleModalClose}
        onVerifyAccount={handleVerifyAccount}
        loading={loading}
        error={error}
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

export default AccountVerification;
