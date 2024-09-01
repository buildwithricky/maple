import React, { useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, StyleSheet } from 'react-native'
import AnimatedInput from '../../Assecories/AnimatedInput'
import CustomButton from '../../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../../navigation';
import { useNavigation } from '@react-navigation/native';

export default function Transfer2() {
    const navigation = useNavigation<ScreenNavigationProp<'Bene_2'>>();
    const [ammount, setAmmount] = useState('');
    const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">

          <View style={styles.inputContainer}>
            <AnimatedInput
              placeholder="Ammount"
              value={ammount}
              onChangeText={setAmmount}
            />
            <AnimatedInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              width={"100%"}
              gradientColors={['#ee0979', '#ff6a00']}
              title="Continue"
              onPress={() => navigation.navigate('wtwTransfer3')}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      marginTop: '8%',
      marginHorizontal: 20,
    },
    container: {
      flex: 1,
    },
    inputContainer: {
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 13,
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      justifyContent: 'center',
      marginBottom: 13,
    },
  });