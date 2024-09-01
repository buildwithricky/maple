import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { API_URl } from '@env';
import { ScreenNavigationProp } from '../../../../navigation';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';

const EmailVerif2 = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'PhoneVerif'>>();

  const sendMobileOtp = async () => {
    setLoading(true); // Start loading
    try {
      const userId = await SecureStore.getItemAsync('userID');
      if (!userId) {
        Alert.alert('Error', 'User ID not found.');
        setLoading(false); // End loading
        return;
      }

      const response = await fetch(`${API_URl}/user/send-mobile-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          property: 'PHONE',
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        Alert.alert('Success', 'OTP sent successfully.');
        sendNotification(data.data.phoneNo, data.data.OTP);
        navigation.navigate('PhoneVerif'); // Navigate to the PhoneVerif page
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'An error occurred while sending OTP.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const sendNotification = async (phoneNo: string, OTP: number) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Phone Number Verification OTP Sent",
        body: `Your OTP is ${OTP} for phone number ${phoneNo}`,
      },
      trigger: null,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <SuccessPage
        title="Verified!"
        subtitle="Your email has been successfully verified. Please click the button below to verify your phone number."
        buttonText="Continue"
        buttonAction={sendMobileOtp}
      />
      {loading && <SpinnerOverlay />}
    </View>
  );
};

export default EmailVerif2;
