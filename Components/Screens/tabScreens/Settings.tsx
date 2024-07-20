import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenNavigationProp } from '../../../navigation';


const sections = [
  {
    title: 'ACCOUNT SETTINGS',
    items: [
      { image: require('../../../assets/MappleApp/profile.png'), text: 'Profile Settings', navigateTo: 'Profile' },
      { image: require('../../../assets/MappleApp/verification.png'), text: 'Account Verification', navigateTo: 'Verification_01', rightIcon: 'verified' },
      { image: require('../../../assets/MappleApp/notifications.png'), text: 'Notifications', navigateTo: 'notification', rightIcon: 'toggle' },
    ]
  },
  {
    title: 'FINANCE SETTINGS',
    items: [
      { image: require('../../../assets/MappleApp/exchange.png'), text: 'Exchange Rate Alerts', navigateTo: 'RateAlerts' },
      { image: require('../../../assets/MappleApp/transaction.png'), text: 'Transaction Limit', navigateTo: 'Transaction' },
    ]
  },
  {
    title: 'SECURITY SETTINGS',
    items: [
      { image: require('../../../assets/MappleApp/change_password.png'), text: 'Change Password', navigateTo: 'Pin' },
      { image: require('../../../assets/MappleApp/two_factor.png'), text: 'Two Factor Verification', navigateTo: 'AccountVerification' },
      { image: require('../../../assets/MappleApp/devices.png'), text: 'Devices and Sessions', navigateTo: 'Device' },
      { image: require('../../../assets/MappleApp/change_pin.png'), text: 'Change your Pin', navigateTo: 'Change' },
    ]
  },
];

const Settings = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Profile' | 'Verification_01' | 'notification' | 'RateAlerts' | 'Transaction' | 'Pin' | 'AccountVerification' | 'Device' | 'Change'>>();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const toggleSwitch = () => setIsSwitchOn(previousState => !previousState);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>

          {sections.map((section, index) => (
            <View key={index}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContainer}>
                {section.items.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.row}
                    onPress={() => navigation.navigate(item.navigateTo)}
                  >
                    <View style={styles.rowLeft}>
                      <Image source={item.image} style={styles.icon} />
                      <Text style={styles.rowText}>{item.text}</Text>
                    </View>
                    {item.rightIcon && item.rightIcon === 'verified' && (
                      <Image source={require('../../../assets/MappleApp/Icon_1.png')} style={styles.rightIcon} />
                    )}
                    {item.rightIcon && item.rightIcon === 'toggle' && (
                      <Switch value={isSwitchOn} onValueChange={toggleSwitch} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    marginTop: -50
  },
  scrollViewContent: {
    padding: 20,
  },
  container: {
    flex: 1,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'medium',
    marginVertical: 10
  },
  sectionTitle: {
    fontSize: 16,
    color: 'grey',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  rowText: {
    fontSize: 16,
    color: '#333',
  },
  rightIcon: {
    width: 20,
    height: 20,
    tintColor: 'red',
  },
});

export default Settings;
