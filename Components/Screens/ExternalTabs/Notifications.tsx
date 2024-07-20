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

const Notifications = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <SuccessPage
        title="Transaction Complete"
        subtitle="Your transfer request was successful"
        buttonText="Finish, Go Homepage"
        buttonAction={() => navigation.navigate('Home')}
      />
    </>
  );
};


export default Notifications;
