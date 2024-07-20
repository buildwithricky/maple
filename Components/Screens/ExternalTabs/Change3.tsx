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

const Change3 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <SuccessPage
        title="Done!"
        subtitle="New Pin chnaged successfully"
        buttonText="Homepage"
        buttonAction={() => navigation.navigate('Home')}
      />
    </>
  );
};


export default Change3;
