import React, { useState, useEffect } from 'react';
import {
  ScrollView,
} from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';

const CreatePin3 = () => {

  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();


  // onPress={() => navigation.navigate('SignIn')}
  return (
    <>
      <SuccessPage
        title="Successful!"
        subtitle="Please click on the button below to verify your Bank Verification Number (BVN)
        "
        buttonText="Verify BVN"
        buttonAction={() => navigation.navigate('BVNverif')}
      />
    </>
  );
};


export default CreatePin3;
