import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import CustomButton2 from '../Assecories/CustomButton2';
import BottomSheetModal from '../Assecories/Modal/Modal1';
import BottomSheetModal2 from '../Assecories/Modal/Modal2';
import { useNavigation } from '@react-navigation/native';
import HomeTab from '../Assecories/HomeTab';
import CustomButton from '../Assecories/CustomButton';
import { ScreenNavigationProp } from '../../../navigation';
import { API_URl } from '@env';

type ValidScreen = 'Home' | 'Transactions' | 'notification' | 'Verification_01' | 'Send' | 'Swap';

type TransactionType = {
  id: string;
  type: string;
  currency: string;
  amount: string;
  date: string;
};

export default function Home() {
  const navigation = useNavigation<ScreenNavigationProp<ValidScreen>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showMore, setShowMore] = useState(false); // State for showing more transactions
  const [currency, setCurrency] = useState('CAD'); // State for currency
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const storedFirstName = await SecureStore.getItemAsync('firstName');
        const storedLastName = await SecureStore.getItemAsync('lastName');
        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
      } catch (error) {
        console.error('Failed to fetch names from SecureStore', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API_URl}/transaction/user?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          setTransactions(result.data.data);
          setTotalPages(result.data.totalPages);
        } else {
          console.error('Error fetching transactions:', result.message);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchNames();
    fetchTransactions();
  }, [currentPage]);

  const loadMoreTransactions = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleNotificationPress = () => {
    setModalVisible(false);
    navigation.navigate('notification');
  };

  const handleNavigation = (screen: ValidScreen) => {
    navigation.navigate(screen);
  };

  const handleVerificationPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleVerifyAccount = () => {
    setModalVisible(false);
    navigation.navigate('Verification_01');
  };

  const handleAddPress = () => {
    setAddModalVisible(true);
  };

  const handleCopyAccountDetails = () => {
    setAddModalVisible(false);
    // Add your copy logic here
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Fund Swap':
        return require("../../../assets/MappleApp/Icon_1.png");
      case 'Incoming Transaction':
        return require("../../../assets/MappleApp/Icon_2.png");
      case 'Outgoing Transaction':
        return require("../../../assets/MappleApp/Icon_3.png");
      default:
        return require("../../../assets/MappleApp/Icon_3.png"); // Default icon if type doesn't match
    }
  };

  const gridItems = [
    { screen: 'Home', source: require("../../../assets/MappleApp/Account.png"), text: 'Account' },
    { screen: '', source: require("../../../assets/MappleApp/Add.png"), text: 'Add', onPress: handleAddPress },
    { screen: 'Send', source: require("../../../assets/MappleApp/send.png"), text: 'Send' },
    { screen: 'Swap', source: require("../../../assets/MappleApp/swap.png"), text: 'Add Fund' },
  ];

  const displayedTransactions = showMore ? transactions : transactions.slice(0, 4);

  return (
    <>
      <ScrollView scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}>
        <SafeAreaView style={styles.loadingContainer}>
          <View style={styles.headerRow}>
            <Image 
              source={require("../../../assets/MappleApp/user.png")}
              style={styles.profileImage} 
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.helloText}>Hello,</Text>
              <Text style={styles.nameText}>{lastName} {firstName} </Text>
              <Ionicons name="checkmark-circle" size={20} color="red"/>
            </View>
            <TouchableOpacity style={styles.notificationContainer} onPress={handleNotificationPress}>
              <Ionicons name="notifications" size={24} color="black" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          <View style={styles.layout}>
            <HomeTab selectedCurrency={currency} onCurrencyChange={setCurrency} />
            <View style={styles.walletInnerContainer}>
              <Text style={styles.walletBalanceText}>Wallet Balance</Text>
              <Text style={styles.walletAmountText}>
                {currency === 'CAD' ? '$1000.00' : '₦200000.00'}
              </Text>
            </View>

            <View style={styles.gridContainer}>
              {gridItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.gridItem}
                  onPress={() => item.onPress ? item.onPress() : handleNavigation(item.screen as ValidScreen)}
                >
                  <Image source={item.source} style={styles.gridImage} />
                  <Text style={styles.gridText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.verificationContainer} onPress={handleVerificationPress}>
            <View style={styles.verificationTextContainer}>
              <Text style={styles.verificationText}>
                <Text style={styles.verificationTextContent}> Account Verification</Text>
                <Ionicons name="arrow-forward" size={16} color="red" />
              </Text>
              <Text style={styles.verificationSubText}>To ensure the security of your account we need to verify your identity!</Text>
            </View>
            <Image source={require("../../../assets/MappleApp/dummy.png")} style={styles.verificationImage} />
          </TouchableOpacity>

          {/* Recent Transactions Container */}
          <View style={styles.layout}>
            <View style={styles.recentTransactionsHeader}>
              <Text style={styles.recentTransactionsHeaderText}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text style={styles.seeMoreText}>{showMore ? "Show Less" : "See More"}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine} />

            {/* Transactions */}
            {displayedTransactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <View style={styles.transactionRow}>
                  <Image source={getTransactionIcon(transaction.type)} style={styles.transactionImage} />
                  <View style={styles.transactionDetailsContainer}>
                    <Text style={styles.transactionTypeText}>{transaction.type}</Text>
                    <Text style={styles.transactionCurrencyText}>{transaction.currency}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmountText}>{transaction.amount}</Text>
                    <Text style={styles.transactionDateText}>{transaction.date}</Text>
                  </View>
                </View>
                <View style={styles.horizontalLine} />
              </React.Fragment>
            ))}       
          </View>
        </SafeAreaView>
      </ScrollView>

      <BottomSheetModal
        isVisible={modalVisible}
        onClose={closeModal}
        onVerifyAccount={handleVerifyAccount}
      />
      <BottomSheetModal2
        isVisible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onVerifyAccount={handleVerifyAccount}
      />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    marginTop: '6%',
    marginHorizontal: 20
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    padding: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  helloText: {
    color: 'grey',
    fontSize: 18,
  },
  nameText: {
    color: 'black',
    fontWeight: "medium",
    fontSize: 18,
    marginLeft: 5,
  },
  notificationContainer: {
    position: 'relative',
    marginLeft: 40,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  layout: {
    backgroundColor: 'white',
    borderRadius: 24,
    borderColor: '#E8E9EA',
    borderWidth: 0.3,
    padding: 20,
    marginTop: 20,
  },
  walletInnerContainer: {
    backgroundColor: '#062135',
    borderRadius: 16,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  walletBalanceText: {
    color: 'white',
    fontSize: 16,
  },
  walletAmountText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  gridItem: {
    alignItems: 'center',
  },
  gridImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  gridText: {
    marginTop: 8,
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
  },
  verificationContainer: {
    backgroundColor: 'rgba(153, 153, 153, 0.123)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 25,
    borderRadius: 10,
  },
  verificationTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  verificationText: {
    flexDirection: 'row', 
    alignItems: 'center', 
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  verificationTextContent: {
    color: '#000000d3',
    fontSize: 17,
    fontWeight: 'bold',
  },
  verificationSubText: {
    color: 'grey',
    fontSize: 13,
    marginTop: 5,
  },
  verificationImage: {
    width: 60,
    height: 60,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: 350,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignItems: "flex-start",
    marginTop: 390, // Adjust this value based on your design needs
  },
  modalImage: {
    width: 140,
    height: 140,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalText: {
    fontSize: 12.5,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
  },
  boxHead:{
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
  },
  boxBody:{
    fontSize: 14,
    color: 'grey',
    marginBottom: 13,
  },
  boxTitle: {
    fontSize: 16,
    color: 'grey',
  },
  boxText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  recentTransactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recentTransactionsHeaderText: {
    fontWeight: 'medium',
    fontSize: 17,
  },
  seeMoreText: {
    color: 'red',
    fontSize: 15,
    fontWeight: '300',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  transactionDetailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  transactionTypeText: {
    fontSize: 14,
    fontWeight: 'medium',
    paddingBottom: 8
  },
  transactionCurrencyText: {
    fontSize: 12,
    color: 'grey',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: 'medium',
    paddingBottom: 8
  },
  transactionDateText: {
    fontSize: 14,
    color: 'grey',
  },
});
