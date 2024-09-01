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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard'; 
import * as SecureStore from 'expo-secure-store'; 
import { API_URl } from '@env'; 
import SpinnerOverlay from '../Assecories/SpinnerOverlay';
import firebase from '../../../config'; 
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

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
  profileImage?: string;
}

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const { uri } = await FileSystem.getInfoAsync(image);
      const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = () => {
          reject(new Error('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();

      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URl}/user/profile-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          imagePath: downloadURL,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', 'Profile Image Uploaded successfully');
        // Update the userData state with the new image URL
        setUserData(prevData => prevData ? {...prevData, profileImage: downloadURL} : null);
      } else {
        Alert.alert('Error', data.message || 'Failed to upload image');
      }
    } catch (err) {
      if (err instanceof Error) {
        Alert.alert('Error', err.message || 'An error occurred');
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_URl}/user/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUserData(data.data);
          setImage(data.data.profileImage || null);
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
    return <SpinnerOverlay />;
  }

  if (error) {
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
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          <Image 
            source={{ uri: image || userData?.profileImage || '../../../assets/MappleApp/user.png' }} 
            style={styles.profileImage} 
          />
          <Ionicons name="camera" size={24} color="red" style={styles.camera} />
        </TouchableOpacity>
        <TouchableOpacity onPress={uploadImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Image</Text>
        </TouchableOpacity>
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
          <Text style={styles.interacEmail}>{userData?.bankAccount?.interacEmail || ''}</Text>
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
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
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
  camera: {
    position: 'absolute',
    bottom: 0,
    right: '37%',
  },
  uploadButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
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
    color: 'grey',
  },
  detailsValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  interacHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  interacHeaderText: {
    fontSize: 16,
    color: 'grey',
    fontWeight: 'bold',
  },
  copyIcon: {
    width: 20,
    height: 20,
  },
  interacContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  interacEmail: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profile;
