import React, { useState, useEffect } from 'react';
import {
  ScrollView,
} from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';

const PhoneVerif2 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'CreatePin'>>();


  return (
    <>
      <SuccessPage
        title="Verified!"
        subtitle="Please click on the button below to create your security pin."
        buttonText="Continue"
        buttonAction={() => navigation.navigate('CreatePin')}
      />
    </>
  );
};


export default PhoneVerif2;
