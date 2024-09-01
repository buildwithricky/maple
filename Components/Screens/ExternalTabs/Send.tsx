import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../../navigation';

const options = [
  {
    id: 1,
    title: 'Send CAD Through Interac Email',
    description: 'Easily send CAD to anyone with an interac email',
    image: require('../../../assets/MappleApp/send_Icon_1.png'),
    page: 'Interac_1' as const,
  },
  {
    id: 2,
    title: 'Send Naira to beneficiary Account',
    description: 'You can easily transfer funds to beneficiaries',
    image: require('../../../assets/MappleApp/send_icon_2.png'),
    page: 'Bene_1' as const,
  },
  {
    id: 3,
    title: 'Maple Email',
    description: 'You can easily transfer funds to Users with maple wallet that is Wallet to Wallet transfer',
    image: require('../../../assets/MappleApp/send_icon_2.png'),
    page: 'wtwTransfer1' as const,
  }
];

export default function Send() {
  const navigation = useNavigation<ScreenNavigationProp<'Interac_1' | 'Bene_1' | 'wtwTransfer1'>>();

  return (
    <SafeAreaView style={styles.loadingContainer}>
      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionContainer}
          onPress={() => navigation.navigate(option.page)}
        >
          <Image source={option.image} style={styles.optionImage} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '10%',
    marginHorizontal: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    position: 'absolute',
    left: 10,
    top: 20,
  },
  headerTitle: {
    flex: 1,    
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'medium',
    marginVertical: 10
  },
  line: {
    height: 1,
    backgroundColor: '#00000032',
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 15,
    borderWidth: 0.5,
    borderColor: "#EEEEEE"
  },
  optionImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 5,
    textTransform: "capitalize"
  },
  optionDescription: {
    fontSize: 12,
    color: 'grey',
    lineHeight: 24,
  },
});
