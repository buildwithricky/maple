import React, { useState, useEffect } from 'react';
import {
  ScrollView,
} from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';

const BVNverif2 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  return (
    <>
      <SuccessPage
        title="Account Created"
        subtitle="Welcome to the Maple Family! Your account has been successfully created, and your wallet is now ready to use."
        buttonText="Login"
        buttonAction={() => navigation.navigate('SignIn')}
      />
    </>
  );
};


export default BVNverif2;
