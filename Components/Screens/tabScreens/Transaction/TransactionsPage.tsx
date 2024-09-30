import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, RefreshControl, Modal } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API_URl } from '@env';
import SpinnerOverlay from '../../Assecories/SpinnerOverlay';
import { ScreenNavigationProp } from '../../../../navigation';
import { useNavigation } from '@react-navigation/native';
import TransactionFilter from './TransactionFilter';
import { Ionicons } from '@expo/vector-icons';

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

type FilterType = {
  startDate?: string;
  endDate?: string;
  currency?: string;
  type?: string;
};

const formatNumber = (num: number) => {
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'TransactionDetail'>>();
  const [filter, setFilter] = useState<FilterType>({});
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      let queryParams = new URLSearchParams({
        page: '1',
        limit: '50', // Fetch more transactions by default
      });

      // Only add filter parameters if they are set
      if (filter.startDate && filter.endDate) {
        queryParams.append('dateFilter', `${filter.startDate},${filter.endDate}`);
      }
      if (filter.currency) {
        queryParams.append('currency', filter.currency);
      }
      if (filter.type) {
        queryParams.append('type', filter.type);
      }

      const response = await fetch(`${API_URl}/mobile-transaction/user?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        const formattedData = result.data.data.map((transaction: any) => ({
          ...transaction,
          createdAt: new Date(transaction.createdAt),
          updatedAt: new Date(transaction.updatedAt),
        }));
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
      case 'FundSwap':
        return require("../../../../assets/MappleApp/Icon_1.png");
      case 'Incoming':
        return require("../../../../assets/MappleApp/Icon_2.png");
      case 'Outgoing':
        return require("../../../../assets/MappleApp/Icon_3.png");
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
    const category = transaction.createdAt ? getTimeCategory(transaction.createdAt) : 'Unknown';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});

  const getTransactionAmount = (transaction: TransactionType) => {
    const amount = transaction.sourceAmount === null || transaction.sourceAmount === undefined
      ? transaction.destinationAmount
      : transaction.sourceAmount;

    if (transaction.sourceCurrency === 'CAD') {
      return `$${formatNumber(amount)}`;
    } else if (transaction.sourceCurrency === 'NGN') {
      return `₦${formatNumber(amount)}`;
    } else {
      return formatNumber(amount); // Format the amount for other currencies as needed
    }
  };

  const handleFilterApply = (newFilter: FilterType) => {
    setFilter(newFilter);
    setIsFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setFilter({});
    setIsFilterModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <SpinnerOverlay />}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.filterButtonContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Ionicons name="filter" size={24} color="black" />
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
        {Object.keys(groupedTransactions).map((category) => (
          <View key={category} style={styles.categoryContainer}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryHeaderText}>{category}</Text>
            </View>
            {groupedTransactions[category].map((transaction: TransactionType) => (
              <TouchableOpacity
                key={transaction._id}
                onPress={() => navigation.navigate('TransactionDetail', { transaction })}
              >
                <View style={styles.transactionRow}>
                  <Image source={getTransactionIcon(transaction.type)} style={styles.transactionImage} />
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionType}>{transaction.description}</Text>
                    <Text style={styles.transactionCurrency}>{transaction.sourceCurrency}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>
                      {getTransactionAmount(transaction)}
                    </Text>
                    <Text style={[styles.transactionStatus, { color: getStatusColor(transaction.status) }]}>
                      {transaction.status}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {transaction.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TransactionFilter onApplyFilter={handleFilterApply} />
            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={handleClearFilter}
            >
              <Text style={styles.clearFilterButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsFilterModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '95%',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterButtonContainer: {
    padding: 10,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 20,
  },
  filterButtonText: {
    marginLeft: 5,
  },
  clearFilterButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  clearFilterButtonText: {
    fontSize: 16,
    color: 'blue',
  },
});

export default TransactionPage;
