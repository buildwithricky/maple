import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import CanadianFlag from '../../../assets/MappleApp/canada.png';
import NigeriaFlag from '../../../assets/MappleApp/Nigeria.png';
import SpinnerOverlay from '../Assecories/SpinnerOverlay';

interface Rate {
  _id: string;
  rate: number;
  exchange: string;
  createdDate: string;
  updatedDate: string;
  __v: number;
}

const RateAlerts = () => {
  const navigation = useNavigation();
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRates = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URl}/rate/get-rates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setRates(data.data);
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

  useEffect(() => {
    fetchRates();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <SpinnerOverlay />
      ) : (
        rates.map((rate) => {
          const isCADtoNGN = rate.exchange === 'CAD-TO-NGN';
          const isNGNtoCAD = rate.exchange === 'NGN-TO-CAD';

          return (
            <View key={rate._id} style={styles.deviceContainer}>
              <View style={styles.row}>
                {isCADtoNGN && (
                  <>
                    <Image source={CanadianFlag} style={styles.flagImage} />
                    <Text style={styles.text}>CAD</Text>
                    <Ionicons name="arrow-forward" size={20} style={styles.icon} />
                    <Image source={NigeriaFlag} style={styles.flagImage} />
                    <Text style={styles.text}>NGN</Text>
                    <Text style={[styles.text, styles.boldText]}>
                      1 CAD = {rate.rate} NGN
                    </Text>
                  </>
                )}
                {isNGNtoCAD && (
                  <>
                    <Image source={NigeriaFlag} style={styles.flagImage} />
                    <Text style={styles.text}>NGN</Text>
                    <Ionicons name="arrow-forward" size={20} style={styles.icon} />
                    <Image source={CanadianFlag} style={styles.flagImage} />
                    <Text style={styles.text}>CAD</Text>
                    <Text style={[styles.text, styles.boldText]}>
                      1 NGN = {rate.rate} CAD
                    </Text>
                  </>
                )}
              </View>
              <Text style={styles.dateText}>
                Updated: {new Date(rate.updatedDate).toLocaleDateString()}
              </Text>
            </View>
          );
        })
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  deviceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  flagImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  text: {
    fontSize: 16,
  },
  boldText: {
    fontWeight: '300',
    paddingLeft: 50,
  },
  dateText: {
    fontSize: 14,
    color: 'grey',
  },
});

export default RateAlerts;
