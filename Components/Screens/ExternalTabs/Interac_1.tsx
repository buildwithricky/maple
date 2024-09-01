import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import * as Clipboard from 'expo-clipboard'; // Import Clipboard from expo-clipboard

export default function Interac_1() {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_2'>>();
  const [verifiedInteracEmail, setVerifiedInteracEmail] = useState('oluwadamilareus@gmail.com'); // Example email, replace with dynamic data

  const handleCopyEmail = () => {
    Clipboard.setString("payments@mpexchange.ca");
    Alert.alert('Copied', 'Email address copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <View style={styles.outerContainer}>
        <Text style={styles.headerText}>Fund with Interac</Text>
        <Text style={styles.instructions}>
          Follow the instructions below to fund your Maple CAD wallet.
        </Text>

        <View style={styles.instructionItem}>
          <Ionicons name="home-outline" size={20} color="#0E314C" />
          <Text style={styles.instructionText}>
            Log into your banking app and send money to payments@mpexchange.ca
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Ionicons name="person-outline" size={20} color="#0E314C" />
          <Text style={styles.instructionText}>
            Make sure you are sending money from your verified Interac address ({verifiedInteracEmail}).
          </Text>
        </View>

        <View style={styles.instructionItem}>
          <Ionicons name="time-outline" size={20} color="#0E314C" />
          <Text style={styles.instructionText}>
            It takes an average of 10-20 minutes for the funds to appear in your wallet.
          </Text>
        </View>

        <View style={styles.copyContainer}>
          <Ionicons name="mail-outline" size={20} color="#0E314C" />
          <View style={styles.copySection}>
            <Text style={styles.emailText}>Payment email</Text>
            <Text style={styles.paymentEmail}>payments@mpexchange.ca</Text>
          </View>
          <TouchableOpacity onPress={handleCopyEmail} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>copy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.helpLink}>
          <Ionicons name="help-circle-outline" size={20} color="#0E314C" />
          <Text style={styles.helpText}>Can’t find your payment?</Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={() => navigation.navigate('Interac_2')}
        />
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '8%',
    marginHorizontal: 20,
  },
  outerContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0E314C',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructionText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  copySection: {
    flex: 1,
    marginLeft: 10,
  },
  emailText: {
    fontSize: 14,
    color: '#555',
  },
  paymentEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0E314C',
  },
  copyButton: {
    backgroundColor: '#0E314C',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  helpText: {
    fontSize: 14,
    color: '#0E314C',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
});
