import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';
import { ScreenNavigationProp } from '../../../../navigation';
import { useNavigation } from '@react-navigation/native';

type TransactionType = {
  _id: string;
  user: string;
  fincraWalletId: string;
  type: string;
  sourceCurrency: string;
  destinationCurrency: string;
  sourceAmount: number;
  destinationAmount: number;
  description: string;
  amountSent: number;
  fee: number;
  status: string;
  reference: string;
  preAmount: number;
  postAmount: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

type GroupedTransactions = {
  [key: string]: TransactionType[];
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'TransactionDetail'>>();

  useEffect(() => {
    fetchTransactions();
  }, []);

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
        const formattedData = result.data.data.map((transaction: any) => {
          const createdAt = new Date(transaction.createdAt);
          const updatedAt = new Date(transaction.updatedAt);
          return {
            ...transaction,
            createdAt: isNaN(createdAt.getTime()) ? null : createdAt,
            updatedAt: isNaN(updatedAt.getTime()) ? null : updatedAt,
          };
        });
        setTransactions(formattedData);
      } else {
        console.error('Error fetching transactions:', result.message);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Outgoing':
        return require("../../../../assets/MappleApp/Icon_3.png");
      case 'Incoming':
        return require("../../../../assets/MappleApp/Icon_2.png");
      default:
        return require("../../../../assets/MappleApp/Icon_3.png");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#888888'; // gray
      case 'successful':
        return '#00FF00'; // green
      case 'Failed':
        return '#FF0000'; // red
      default:
        return '#000000'; // black
    }
  };

  const getTimeCategory = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 1) {
      return "Today";
    } else if (diffInDays < 7) {
      return "This week";
    } else if (diffInDays < 30) {
      return "This month";
    } else {
      return "Forever";
    }
  };

  const groupedTransactions = transactions.reduce<GroupedTransactions>((acc, transaction) => {
    const category = transaction.createdAt ? getTimeCategory(new Date(transaction.createdAt)) : 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      {loading && <SpinnerOverlay />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.keys(groupedTransactions).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {groupedTransactions[category].map((transaction: TransactionType) => (
              <TouchableOpacity
                key={transaction._id}
                onPress={() => navigation.navigate('TransactionDetail', { transaction })}
              >
                <View key={transaction._id} style={styles.transactionRow}>
                  <Image source={getTransactionIcon(transaction.type)} style={styles.transactionImage} />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>{transaction.description}</Text>
                    <Text style={styles.transactionCurrency}>{transaction.sourceCurrency}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>{transaction.sourceAmount}</Text>
                    <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>{transaction.status}</Text>
                    <Text style={styles.transactionDate}>
                      {transaction.createdAt ? transaction.createdAt.toLocaleDateString() : 'Invalid Date'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    padding: 20,
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: "medium",
    marginBottom: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    padding: 15,
    marginVertical: 7,
  },
  transactionImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionType: {
    fontSize: 16,
  },
  transactionCurrency: {
    fontSize: 14,
    color: '#888',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
  },
  transactionStatus: {
    fontSize: 14,
    paddingVertical: 2,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
    paddingVertical: 2,
  },
});

export default TransactionPage;
