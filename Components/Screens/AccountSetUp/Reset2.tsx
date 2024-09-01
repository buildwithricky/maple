import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import CustomButton from '../Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../../navigation';

const Reset2 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Reset3'>>();

  // Function to open the default mail app
  const openMailApp = async () => {
    try {
      let url = '';
      if (Platform.OS === 'ios') {
        url = 'message:';
      } else if (Platform.OS === 'android') {
        url = 'mailto:';
      }
  
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
        navigation.navigate('Reset3');
      } else {
        console.log('No email app available');
        // You might want to show an alert to the user here
      }
    } catch (err) {
      console.error('An error occurred', err);
      // You might want to show an error message to the user here
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
            Follow the instructions in the email to set a new password and regain access to your account. If you don't receive the email within a few minutes, please check your spam folder or try again.
          </Text>
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            width={"95%"}
            gradientColors={['#ee0979', '#ff6a00']}
            title="Open Email"
            onPress={openMailApp}
          />
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
    marginHorizontal: 20
  },
});

export default Reset2;
