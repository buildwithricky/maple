import React, { useState, useEffect } from 'react';
import {
  ScrollView,
} from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';

const EmailVerif2 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'CreatePin'>>();


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
