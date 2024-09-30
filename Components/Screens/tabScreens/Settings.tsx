import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import { ScreenNavigationProp, RootStackParamList } from '../../../navigation';

type SettingsProps = {
  setIsUserLoggedIn: (loggedIn: boolean) => void;
  setActiveToken: (token: string) => void;
  setPinLoggedIn: (loggedIn: boolean) => void;
};

type SectionItem = {
  image: any;
  text: string;
  navigateTo: keyof RootStackParamList;
  rightIcon?: 'verified' | 'toggle1' | 'toggle2';
};

const sections: Array<{ title: string; items: SectionItem[] }> = [
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
      { image: require('../../../assets/MappleApp/change_pin.png'), text: 'Change your Pin', navigateTo: 'Change' },
      { image: require('../../../assets/MappleApp/change_pin.png'), text: 'Logout', navigateTo: 'SignIn' },
    ]
  },
];

const Settings: React.FC<SettingsProps> = ({ setIsUserLoggedIn, setActiveToken, setPinLoggedIn }) => {
  const navigation = useNavigation<ScreenNavigationProp<keyof RootStackParamList>>();
  const [isSwitchOn1, setIsSwitchOn1] = useState(false);
  const [isSwitchOn2, setIsSwitchOn2] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTwoFactorState();
  }, []);

  const loadTwoFactorState = async () => {
    try {
      const twoFactorEnabled = await SecureStore.getItemAsync('twoFactorEnabled');
      setIsSwitchOn2(twoFactorEnabled === 'true');
    } catch (error) {
      console.error('Error loading 2FA state:', error);
    }
  };

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
        await SecureStore.setItemAsync('twoFactorEnabled', newValue.toString());
      } else {
        Alert.alert('Error', data.message || 'Unknown error');
        setIsSwitchOn2(!newValue);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
      setIsSwitchOn2(!newValue);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    console.log("logging out");
    try {
      await Promise.all([
        SecureStore.deleteItemAsync('firstName'),
        SecureStore.deleteItemAsync('lastName'),
        SecureStore.deleteItemAsync('email'),
        SecureStore.deleteItemAsync('token'),
        SecureStore.deleteItemAsync('id'),
      ]);
      setIsUserLoggedIn(false);
      setActiveToken("");
      setPinLoggedIn(false);
      navigation.navigate("SignIn");
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
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
                    onPress={() => {
                      if (item.navigateTo === 'SignIn') {
                        handleLogout();
                        return;
                      }
                      navigation.navigate(item.navigateTo);
                    }}
                  >
                    <View style={styles.rowLeft}>
                      <Image source={item.image} style={styles.icon} />
                      <Text style={styles.rowText}>{item.text}</Text>
                    </View>
                    {item.rightIcon === 'verified' && (
                      <Image source={require('../../../assets/MappleApp/Icon_1.png')} style={styles.rightIcon} />
                    )}
                    {item.rightIcon === 'toggle1' && (
                      <Switch value={isSwitchOn1} onValueChange={toggleSwitch1} />
                    )}
                    {item.rightIcon === 'toggle2' && (
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