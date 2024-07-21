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
        subtitle="You have successfully set up your pin."
        buttonText="Login"
        buttonAction={() => navigation.navigate('SignIn')}
      />
    </>
  );
};


export default CreatePin3;
