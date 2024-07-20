import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import CustomButton from '../../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import SuccessPage from '../../Assecories/SuccessPage';
import { ScreenNavigationProp } from '../../../../navigation';
import { API_URl } from '@env'; // Importing API_URl from the .env file

const CreatePin3 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'SignIn'>>();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URl}/create-pin`) // Assuming the endpoint is '/create-pin'
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error.message}</Text>
        <CustomButton
          width={163}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Retry"
          onPress={() => {
            setLoading(true);
            setError(null);
            // Retry the fetch
            fetch(`${API_URl}/create-pin`) // Assuming the endpoint is '/create-pin'
              .then(response => response.json())
              .then(data => {
                setData(data);
                setLoading(false);
              })
              .catch(error => {
                setError(error);
                setLoading(false);
              });
          }}
          textStyle={{ color: 'white' }}
        />
      </View>
    );
  }

  return (
    <>
      <SuccessPage
        title="Successful!"
        subtitle="You have successfully set up your pin."
        buttonText="Login"
        buttonAction={() => navigation.navigate('SignIn')}
      />
      <ScrollView>
        <Text>Data from API:</Text>
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </>
  );
};

export default CreatePin3;