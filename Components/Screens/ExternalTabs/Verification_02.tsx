import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Importing from expo-image-picker instead
import CustomButton from '../Assecories/CustomButton';
import BottomSheetModal3 from '../Assecories/Modal/Modal3';
import AnimatedInput from '../Assecories/AnimatedInput';

export default function Verification_02({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('Document type');
  const [number, setNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, completed

  const handleSelectDocument = (documentType: string) => {
    setSelectedDocument(documentType);
  };

  const handleFileUpload = async () => {
    let result;
    if (Platform.OS === 'web') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      setSelectedFile(result);
      setUploadStatus('uploading');

      // Simulate upload time
      setTimeout(() => {
        setUploadStatus('completed');
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.uploadText}>Upload your Document</Text>
      <Text style={styles.subText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
      </Text>
      <TouchableOpacity style={styles.selectContainer} onPress={() => setModalVisible(true)}>
        <Text style={styles.selectText}>{selectedDocument}</Text>
        <Ionicons name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="NIN Number"
          value={number}
          onChangeText={setNumber}
        />
      </View>
      <TouchableOpacity style={styles.uploadContainer} onPress={handleFileUpload}>
        <Text style={styles.uploadTitle}>Upload Proof of Identity</Text>
        <View style={styles.iconRow}>
          <Ionicons name="document-attach" size={25} color="grey" />
          <Text style={styles.uploadDescription}>Lorem ipsum dolor sit amet consectetur</Text>
        </View>
      </TouchableOpacity>
        {selectedFile && (
          <View style={styles.fileContainer}>
            <Ionicons name="image" size={24} color="grey" />
            <Text style={styles.fileName}>{selectedFile && selectedFile.name ? selectedFile.name : ''}</Text>
            <Text style={styles.uploadingText}>
              {uploadStatus === 'uploading' ? 'Uploading...' : 'Completed'}
            </Text>
            {uploadStatus === 'uploading' ? (
              <ActivityIndicator size="small" color="green" />
            ) : (
              <Ionicons name="checkmark-circle" size={24} color="green" />
            )}
          </View>        
        )}
      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={() => navigation.navigate('Verification_03')}
        />
      </View>
      <BottomSheetModal3
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectDocument={handleSelectDocument}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: '8%',
  },
  uploadText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'left',
    marginBottom: 30,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 14,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectText: {
    fontSize: 16,
    color: 'grey',
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    marginBottom: 20,
    backgroundColor: "#fff",
    zIndex: 2
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadDescription: {
    fontSize: 14,
    color: 'grey',
    marginLeft: 10,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -30,
    backgroundColor: "#E7EAED",
    padding: 20,
    borderRadius: 16,
  },
  fileName: {
    fontSize: 14,
    color: 'black',
    marginHorizontal: 10,
    flex: 1, // Ensure text doesn't overflow
  },
  uploadingText: {
    fontSize: 14,
    color: 'green',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
});
