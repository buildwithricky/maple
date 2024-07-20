import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../Assecories/CustomButton';
import BottomSheetModal3 from '../Assecories/Modal/Modal3';

export default function Verification_01({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('Document type');

  const handleSelectDocument = (documentType: string) => {
    setSelectedDocument(documentType);
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
      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Continue"
          onPress={() => navigation.navigate('Verification_02')}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    position: 'absolute',
    left: 0,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00000071',
  },
  line: {
    height: 1,
    backgroundColor: '#00000032',
    marginBottom: 20,
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
    lineHeight: 20
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#BBBCBF',
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
});
