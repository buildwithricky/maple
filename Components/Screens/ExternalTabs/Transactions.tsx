import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const Transactionss = [
  { id: 1, message: "Transaction Confirmation", date: "Your CAD to Naira exchange of $100 was successful. You've received N38,000 in your account.", image: require("../../../assets/MappleApp/icon_11.png") },
  { id: 2, message: "Exchange Rate Alerts", date: "CAD to Naira exchange rate has increased! Now's a great time to swap currencies.", image: require("../../../assets/MappleApp/icon_12.png") },
  { id: 3, message: "Security Alerts", date: "Unusual Activity detected on your account. Please verify your recent transactions.", image: require("../../../assets/MappleApp/icon_13.png") },
  { id: 4, message: "Account Verification", date: "Complete your account verification process to unlock higher exchange limits and additional features.", image: require("../../../assets/MappleApp/icon_14.png") },
  // Add more Transactions as needed
];

const Transactions = () => {
  const [markAllRead, setMarkAllRead] = useState(false);

  const handleMarkAllAsRead = () => {
    setMarkAllRead(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Transactions</Text>

        <View style={styles.headerRow}>
          <Text style={styles.todayText}>TODAY</Text>
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all as Read</Text>
          </TouchableOpacity>
        </View>

        {Transactionss.map((Transactions) => (
          <View key={Transactions.id} style={styles.TransactionsRow}>
            <Image source={Transactions.image} style={styles.TransactionsImage} />
            <View style={styles.TransactionsTextContainer}>
              <Text style={styles.TransactionsMessage}>{Transactions.message}</Text>
              <Text style={styles.TransactionsDate}>{Transactions.date}</Text>
            </View>
            
          </View>          
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'medium',
    marginVertical: 10
  },
  underline: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  todayText: {
    fontSize: 16,
    color: '#000',
  },
  markAllReadText: {
    fontSize: 16,
    color: 'red',
  },
  TransactionsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 30,
    borderWidth: 0.5,
    borderColor: "#EEEEEE"
  },
  TransactionsImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  TransactionsTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  TransactionsMessage: {
    fontSize: 16,
    color: '#000',
    paddingBottom: 5
  },
  TransactionsDate: {
    fontSize: 14,
    color: 'grey',
    lineHeight: 24
  },
});

export default Transactions;
