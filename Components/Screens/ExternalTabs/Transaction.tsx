import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Transaction = () => {
  const navigation = useNavigation();
  const accounts = [
    { name: 'Canadian Dollar', flag: '🇨🇦', subtitle: 'Account number, IBAN', screen: 'CADLimits' },
    { name: 'Nigerian Naira', flag: '🇳🇬', subtitle: 'Account number', screen: 'NGNLimits' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.subheader}>Choose account to see send and receive limit</Text>
      <ScrollView style={styles.accountList}>
        {accounts.map((account, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.accountItem}
            onPress={() => navigation.navigate(account.screen)}
          >
            <View style={styles.flagContainer}>
              <Text style={styles.flag}>{account.flag}</Text>
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.name}</Text>
              {account.subtitle && <Text style={styles.accountSubtitle}>{account.subtitle}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 14,
    color: '#666',
    padding: 16,
    paddingTop: 8,
    textAlign: "center"
  },
  accountList: {
    flex: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  flag: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default Transaction;