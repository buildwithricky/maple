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

const Verification_05 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <SuccessPage
        title="Verification Complete"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
        buttonText="Back to homepage"
        buttonAction={() => navigation.navigate('Home')}
      />
    </>
  );
};


export default Verification_05;
