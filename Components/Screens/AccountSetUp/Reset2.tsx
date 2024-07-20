import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env'; // Importing API_URl from the .env file

const Reset2 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Reset3'>>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmailStatus = async () => {
      try {
        const response = await fetch(`${API_URl}/user/check-email-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          // Email sent successfully, proceed to next step
        } else {
          setError(data.message || 'Unknown Error');
        }
      } catch (error) {
        console.error('Error:', error);
        // setError('Unknown Error');
      } finally {
        setLoading(false);
      }
    };
    fetchEmailStatus();
  }, []);

  const handleOpenEmailPress = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URl}/user/open-email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        navigation.navigate('Reset3');
      } else {
        setError(data.message || 'Unknown Error');
      }
    } catch (error) {
      console.error('Error:', error);
      // setError('Unknown Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../../../assets/MappleApp/icon_message.png')}
            style={styles.image}
          />
          <Text style={styles.title}>We just sent a link!</Text>
          <Text style={styles.subtitle}>
            Follow the instructions in the email to set a new password and regain
            access to your account. If you don't receive the email within a few
            minutes, please check your spam folder or try again
          </Text>
        </View>

        {error && (
          <Text style={styles.errorMessage}>{error}</Text>
        )}

        {/* Button */}
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            <CustomButton
              width={"95%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Open Email"
              onPress={handleOpenEmailPress}
            />
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15, 
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  image: {
    marginTop: 70,
    width: 150,
    marginBottom: -80,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 9,
  },
  subtitle: {
    fontSize: 13,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Reset2;
