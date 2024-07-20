import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';

const AccountVerification2 = () => {
  const navigation = useNavigation<ScreenNavigationProp<'AccountVerification3'>>();
  const [copied, setCopied] = useState(false);

  const handleCopyKey = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Enable Security App</Text>
        <Text style={styles.subtitle}>
          To enable 2FA, Please install an authenticator app on your phone and scan the QR Code below
        </Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/MappleApp/qr_code.png')}
            style={styles.qrImage}
          />
        </View>
        <Text style={styles.footerText}>
          Can't scan QR Code? Configure your app with this key:
        </Text>
        <View style={styles.keyContainer}>
          <Text style={styles.keyText}>2egyt567khfgkhfyfgjorb677hhv2jfhbvqb2lfbhd</Text>
          <Ionicons
            name="copy"
            size={24}
            color={copied ? 'green' : 'red'}
            style={styles.copyIcon}
            onPress={handleCopyKey}
          />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={() => navigation.navigate('AccountVerification3')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backArrow: {
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: 'grey',
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
    textAlign: 'left',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  qrImage: {
    width: 200,
    height: 200,
  },
  footerText: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
    textAlign: 'left',
  },
  keyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  keyText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  copyIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
    marginBottom: 13,
    marginHorizontal: 20
  },
});

export default AccountVerification2;
