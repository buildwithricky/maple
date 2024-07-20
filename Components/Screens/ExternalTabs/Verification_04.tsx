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
import PendingPage from '../Assecories/PendingPage';
import { ScreenNavigationProp } from '../../../navigation';

const Verification_04 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <PendingPage
        title="Verification Pending"
        subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
        buttonText="Finish"
        buttonAction={() => navigation.navigate('Verification_05')}
      />
    </>
  );
};


export default Verification_04;
