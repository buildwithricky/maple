import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import { ScreenNavigationProp } from '../../../navigation';

const sections = [
  {
    title: 'ACCOUNT SETTINGS',
    items: [
      { image: require('../../../assets/MappleApp/profile.png'), text: 'Profile Settings', navigateTo: 'Profile' },
      { image: require('../../../assets/MappleApp/verification.png'), text: 'Account Verification', navigateTo: 'Verification_01', rightIcon: 'verified' },
      { image: require('../../../assets/MappleApp/notifications.png'), text: 'Notifications', navigateTo: 'notification', rightIcon: 'toggle1' },
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
      { image: require('../../../assets/MappleApp/two_factor.png'), text: 'Two Factor Verification', navigateTo: 'AccountVerification', rightIcon: 'toggle2' },
      { image: require('../../../assets/MappleApp/devices.png'), text: 'Devices and Sessions', navigateTo: 'Device' },
      { image: require('../../../assets/MappleApp/change_pin.png'), text: 'Change your Pin', navigateTo: 'Change' },
    ]
  },
];

const Settings = () => {
  const navigation = useNavigation<ScreenNavigationProp<'Profile' | 'Verification_01' | 'notification' | 'RateAlerts' | 'Transaction' | 'Pin' | 'AccountVerification' | 'Device' | 'Change'>>();
  const [isSwitchOn1, setIsSwitchOn1] = useState(false);
  const [isSwitchOn2, setIsSwitchOn2] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleSwitch1 = () => setIsSwitchOn1(previousState => !previousState);

  const toggleSwitch2 = async () => {
    const newValue = !isSwitchOn2;
    setIsSwitchOn2(newValue);
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }

      const endpoint = newValue ? `${API_URl}/user/activate2FA` : `${API_URl}/user/deactivate2FA`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ twoFactorEnabled: newValue }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message || 'Unknown error');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

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
                    {item.rightIcon && item.rightIcon === 'toggle1' && (
                      <Switch value={isSwitchOn1} onValueChange={toggleSwitch1} />
                    )}
                    {item.rightIcon && item.rightIcon === 'toggle2' && (
                      <View style={styles.toggleContainer}>
                        <Switch value={isSwitchOn2} onValueChange={toggleSwitch2} />
                        {loading && <ActivityIndicator size="small" color="#0000ff" />}
                      </View>
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default Settings;
