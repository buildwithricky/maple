import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URL } from '@env'; // Importing API_URL from the .env file

const Reset4 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();

  useEffect(() => {
    const fetchResetStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/user/reset-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          // Password reset successful, proceed to success page
        } else {
          setError(data.message || 'Unknown Error');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Unknown Error');
      } finally {
        setLoading(false);
      }
    };
    fetchResetStatus();
  }, []);

  const handleLoginPress = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* login credentials */ }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('SignIn');
      } else {
        setError(data.message || 'Unknown Error');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Unknown Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <SuccessPage
          title="Successful!"
          subtitle="Your password has been successfully reset. You can now use your new password to log in to your account."
          buttonText="Login"
          buttonAction={handleLoginPress}
        />
      )}
      {error && (
        <Text style={styles.errorMessage}>{error}</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Reset4;