import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard'; // Import Clipboard from expo-clipboard
import * as SecureStore from 'expo-secure-store'; // Import SecureStore from expo-secure-store
import { API_URl } from '@env'; // Importing API_URl from the .env file
import SpinnerOverlay from '../Assecories/SpinnerOverlay';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  mail: {
    email: string;
  };
  birthdate: string;
  bankAccount?: {
    interacEmail?: string;
  };
}

const Profile = () => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token'); // Get the token from SecureStore
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URl}/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUserData(data.data);
        } else {
          setError(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'An error occurred');
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const copyToClipboard = () => {
    if (userData && userData.mail && userData.mail.email) {
      Clipboard.setString(userData.mail.email);
      Alert.alert('Copied', 'Email address copied to clipboard');
    }
  };

  if (loading) {
    return (
      <SpinnerOverlay />
    );
  }

  if (error) {
    console.error('Error fetching user data:', error);
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.profileImageContainer}>
          <Image source={require('../../../assets/MappleApp/user.png')} style={styles.profileImage} />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>PERSONAL DETAILS</Text>
          <Ionicons name="create-outline" size={24} color="red" style={styles.editIcon} />
        </View>
        <View style={styles.detailsContainer}>
          {userData && (
            <>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>First Name</Text>
                <Text style={styles.detailsValue}>{userData.firstName}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Last Name</Text>
                <Text style={styles.detailsValue}>{userData.lastName}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Phone Number</Text>
                <Text style={styles.detailsValue}>{userData.phone}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Email</Text>
                <Text style={styles.detailsValue}>{userData.mail.email}</Text>
              </View>
              <View style={styles.detailsRow}>
                <Text style={styles.detailsLabel}>Date of Birth</Text>
                <Text style={styles.detailsValue}>{new Date(userData.birthdate).toLocaleDateString()}</Text>
              </View>
            </>
          )}
        </View>
        <View style={styles.interacHeaderContainer}>
          <Text style={styles.interacHeaderText}>INTERAC E-TRANSFER</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <Ionicons name="copy-outline" size={20} color="red" style={styles.copyIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.interacContainer}>
          <Text style={styles.interacEmail}>{userData && userData.bankAccount && userData.bankAccount.interacEmail}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
  },
  editIcon: {
    width: 24,
    height: 24,
  },
  detailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#494D55',
  },
  detailsValue: {
    fontSize: 14,
    color: '#1C202B',
    fontWeight: 'medium',
  },
  interacHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  interacHeaderText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
    marginRight: 5,
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  interacContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
  },
  interacEmail: {
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
