import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';
import { API_URl } from '@env'; // Importing API_URl from the .env file
import CustomButton2 from '../../Assecories/CustomButton2';

const EmailVerif2 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'CreatePin'>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URl}/user/verified`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          console.log('Email Verified');
        } else {
          console.log('Verification Failed:', data.message || 'Unknown Error');
          setError(new Error(data.message || 'Unknown Error'));
        }
      } catch (error) {
        console.error('Verification Error:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
        <CustomButton2
          title="Retry"
          onPress={() => {
            setError(null);
            // Retry the fetch
          }}
          width={''} 
        />
      </View>
    );
  }

  return (
    <>
      <SuccessPage
        title="Verified!"
        subtitle="Now you are verified. Set a pin for security reasons."
        buttonText="Continue"
        buttonAction={() => navigation.navigate('CreatePin')}
      />
    </>
  );
};

export default EmailVerif2;
