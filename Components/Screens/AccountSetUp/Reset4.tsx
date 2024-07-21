import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../navigation';

const Reset4 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <SuccessPage
        title="Successful!"
        subtitle="Your password has been successfully reset. You can now use your new password to log in to your account."
        buttonText="Login"
        buttonAction={() => navigation.navigate('SignIn')}
      />
    </>
  );
};


export default Reset4;
