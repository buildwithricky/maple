import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../Assecories/CustomButton';
import AnimatedInput from '../Assecories/AnimatedInput';

export default function Verification_03({ navigation }) {  const [number, setNumber] = useState('');


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>2 of 2</Text>
      </View>
      <View style={styles.line} />
      <Text style={styles.uploadText}>Add BVN Number</Text>
      <Text style={styles.subText}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
      </Text>
      <View style={styles.inputContainer}>
        <AnimatedInput
          placeholder="BVN"
          value={number}
          onChangeText={setNumber}
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          width={"100%"}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Submit"
          onPress={() => navigation.navigate('Verification_04')}
        />
      </View>
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
  inputContainer: {
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 13,
  },
});
