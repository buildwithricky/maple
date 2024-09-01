import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, RefreshControl } from 'react-native';
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
import { BlurView } from 'expo-blur';
import * as Notifications from 'expo-notifications';

type ValidScreen = 'Home' | 'Transactions' | 'notification' | 'Verification_01' | 'Send' | 'Swap' | 'TransactionsList';

type TransactionType = {
  _id: string;
  type: string;
  sourceCurrency: string;
  sourceAmount: string;
  createdAt: string;
};
type UserData = {
  profileImage?: string;
};

export default function Home() {
  const navigation = useNavigation<ScreenNavigationProp<ValidScreen>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [showMore, setShowMore] = useState(false); 
  const [currency, setCurrency] = useState('CAD');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVerified, setIsVerified] = useState(false);
  const [nairaBalance, setNairaBalance] = useState('₦0.00');
  const [refreshing, setRefreshing] = useState(false);
  const [prevBalance, setPrevBalance] = useState('₦0.00');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    requestNotificationPermission();
    fetchAllData();
    const intervalId = setInterval(fetchTransactions, 10000); // Poll every 10 seconds
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [currentPage]);
  
  useEffect(() => {
    const fetchBalanceAndUpdate = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const response = await fetch(`${API_URl}/wallet/balance/ngn`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          const newBalance = `₦${result.data.walletBalance}`;
          if (newBalance !== prevBalance) {
            setPrevBalance(newBalance);
            setNairaBalance(newBalance);
          }
        } else {
          console.error('Error fetching wallet balance:', result.message);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
      }
    };
  
    const intervalId = setInterval(fetchBalanceAndUpdate, 10000); // Poll every 10 seconds
  
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [prevBalance]);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('You need to enable notifications in your settings.');
    }
  };
  
  const fetchAllData = async () => {
    await fetchNames();
    await fetchTransactions();
    await checkVerificationStatus();
    await fetchNairaBalance();
  };

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
      const response = await fetch(`${API_URl}/mobile-transaction/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        const newTransactions = result.data.data.map((transaction: TransactionType) => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt).toISOString(), // Change to ISO string for accurate comparison
        }));
        if (JSON.stringify(transactions) !== JSON.stringify(newTransactions)) {
          handleNewTransactions(newTransactions);
          setTransactions(newTransactions);
        }
      } else {
        console.error('Error fetching transactions:', result.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  const handleNewTransactions = (newTransactions: TransactionType[]) => {
    newTransactions.forEach(transaction => {
      const createdAt = new Date(transaction.createdAt).getTime();
      const now = Date.now();
      if (now - createdAt <= 10000) { // 1 minute
        sendNotification(transaction);
      }
    });
  };
  
  const sendNotification = async (transaction: TransactionType) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "New Transaction Alert",
        body: `You have a new transaction: ${transaction.type} of ${transaction.sourceAmount} ${transaction.sourceCurrency}`,
      },
      trigger: null,
    });
  };
  
  const checkVerificationStatus = async () => {
    try {
      const isVerified = await SecureStore.getItemAsync('accountVerif');
      if (isVerified) {
        setIsVerified(isVerified === 'false');
      }
    } catch (error) {
      console.error('Failed to fetch verification status from SecureStore', error);
    }
  };

  const fetchNairaBalance = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await fetch(`${API_URl}/wallet/balance/ngn`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        const newBalance = `₦${result.data.walletBalance}`;
        setNairaBalance(newBalance);
        setPrevBalance(newBalance);
        await SecureStore.setItemAsync('walletBalance', newBalance);
      } else {
        console.error('Error fetching wallet balance:', result.message);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const loadMoreTransactions = () => {
    navigation.navigate('TransactionsList')
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
      case 'Incoming':
        return require("../../../assets/MappleApp/Icon_2.png");
      case 'Outgoing':
        return require("../../../assets/MappleApp/Icon_3.png");
      default:
        return require("../../../assets/MappleApp/Icon_3.png");
    }
  };

  const gridItems = [
    { screen: 'Home', source: require("../../../assets/MappleApp/Account.png"), text: 'Account' },
    { screen: '', source: require("../../../assets/MappleApp/Add.png"), text: 'Add', onPress: handleAddPress },
    { screen: 'Send', source: require("../../../assets/MappleApp/send.png"), text: 'Send' },
    // { screen: 'Swap', source: require("../../../assets/MappleApp/swap.png"), text: 'Add Fund' },
  ];

  const displayedTransactions = showMore ? transactions : transactions.slice(0, 4);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day}/${month} ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };


  return (
    <>
      <ScrollView
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <SafeAreaView style={styles.loadingContainer}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={{ uri: image || userData?.profileImage || '../../../assets/MappleApp/user.png' }} 
                style={styles.profileImage} 
              />
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.helloText}>Hello,</Text>
              <Text style={styles.nameText}>{lastName} {firstName}</Text>
              {isVerified && <Ionicons name="checkmark-circle" size={20} color="red" />}
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
                {currency === 'CAD' ? '$1000.00' : nairaBalance}
              </Text>
              {!isVerified && (
                <BlurView intensity={50} style={StyleSheet.absoluteFill} />
              )}
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

          {!isVerified && 
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
          }

          {/* Recent Transactions Container */}
          <View style={styles.layout}>
            <View style={styles.recentTransactionsHeader}>
              <Text style={styles.recentTransactionsHeaderText}>Recent Transactions</Text>
              {/* <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text style={styles.seeMoreText}>{showMore ? "Show Less" : "See More"}</Text>
              </TouchableOpacity> */}
            </View>
            <View style={styles.horizontalLine} />

            {/* Transactions */}
            {displayedTransactions.map((transaction) => (
              <TouchableOpacity 
                key={transaction._id}  // Unique key for each transaction
                onPress={() => navigation.navigate('TransactionDetail', { transaction })}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: "#f0f0f0", borderBottomWidth: 1 }}
              >
                <View style={styles.transactionRow}>
                  <Image source={getTransactionIcon(transaction.type)} style={styles.transactionImage} />
                  <View style={styles.transactionDetailsContainer}>
                    <Text style={styles.transactionTypeText}>{transaction.type}</Text>
                    <Text style={styles.transactionCurrencyText}>{transaction.sourceCurrency}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmountText}>{transaction.sourceAmount}</Text>
                    <Text style={styles.transactionDateText}>{formatDate(transaction.createdAt)}</Text>
                  </View>
                </View>
                <View style={styles.horizontalLine} />
              </TouchableOpacity>
            ))}
          </View>

            <TouchableOpacity
              onPress={loadMoreTransactions}
              style={{
                backgroundColor: '#fff',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 20,
                marginHorizontal: 15, // Adjust as needed
              }}
            >
              <Text style={{ color: 'red', fontSize: 16 }}>Load More</Text>
            </TouchableOpacity>

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
    textAlign: "center"
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
