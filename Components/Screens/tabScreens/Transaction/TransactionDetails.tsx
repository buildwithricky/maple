import React, { useRef, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import CustomButton from '../../Assecories/CustomButton';

interface TransactionDetailProps {
  route: {
    params: {
      transaction: {
        _id?: string;
        user?: string;
        fincraWalletId?: string;
        type?: string;
        sourceCurrency?: string;
        destinationCurrency?: string;
        sourceAmount?: number;
        destinationAmount?: number;
        description?: string;
        amountSent?: number;
        fee?: number;
        status?: string;
        reference?: string;
        preAmount?: number;
        postAmount?: number;
        createdAt?: Date;
        updatedAt?: Date;
        __v?: number;
      };
    };
  };
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ route }) => {
  const { transaction } = route.params;
  const viewShotRef = useRef<ViewShot>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const shareImage = async () => {
    if (!isCapturing) {
      setIsCapturing(true);
      try {
        if (viewShotRef.current && viewShotRef.current.capture) {
          const uri = await viewShotRef.current.capture();

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
          } else {
            Alert.alert('Error', 'Sharing is not available on this device');
          }
        } else {
          throw new Error('ViewShot reference or capture method is not available');
        }
      } catch (error) {
        console.error('Error sharing image:', error);
        Alert.alert('Error', 'Failed to capture and share the image. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'successful':
        return 'green';
      case 'pending':
        return '#FFA500';
      case 'failed':
        return 'red';
      default:
        return '#333333'; // Default color if status is unknown
    }
  };

  const renderDetailItem = (label: string, value: any) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value !== undefined ? value.toString() : 'N/A'}</Text>
    </View>
  );

  const formatTransactionHeader = (transaction: TransactionDetailProps['route']['params']['transaction']) => {
    if (transaction.type === "FundSwap") {
      if (transaction.sourceCurrency === "CAD" && transaction.destinationCurrency === "NGN") {
        return (
          <>
            <Text style={styles.amount}>CAD {transaction.sourceAmount?.toLocaleString()} → NGN {transaction.destinationAmount?.toLocaleString()}</Text>
            <Text style={styles.conversionText}>CAD → NGN</Text>
          </>
        );
      } else if (transaction.sourceCurrency === "NGN" && transaction.destinationCurrency === "CAD") {
        return (
          <>
            <Text style={styles.amount}>NGN {transaction.sourceAmount?.toLocaleString()} → CAD {transaction.destinationAmount?.toLocaleString()}</Text>
            <Text style={styles.conversionText}>NGN → CAD</Text>
          </>
        );
      }
    }
    
    // Default case for other transaction types or currency pairs
    return (
      <Text style={styles.amount}>{transaction.sourceCurrency} {transaction.destinationAmount?.toLocaleString()}</Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
          <View style={styles.captureContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerStatus, { color: getStatusColor(transaction.status) }]}>
                {transaction.status?.toUpperCase()}
              </Text>
              {formatTransactionHeader(transaction)}
              <Text style={styles.date}>{new Date(transaction.createdAt!).toLocaleString()}</Text>
            </View>

            <View style={styles.detailContainer}>
              {renderDetailItem('Transaction ID', transaction._id)}
              {renderDetailItem('User ID', transaction.user)}
              {renderDetailItem('Fincra Wallet ID', transaction.fincraWalletId)}
              {renderDetailItem('Type', transaction.type)}
              {renderDetailItem('Source Currency', transaction.sourceCurrency)}
              {renderDetailItem('Destination Currency', transaction.destinationCurrency)}
              {renderDetailItem('Source Amount', ` ${transaction.sourceAmount?.toLocaleString()}`)}
              {renderDetailItem('Destination Amount', ` ${transaction.destinationAmount?.toLocaleString()}`)}
              {renderDetailItem('Description', transaction.description)}
              {renderDetailItem('Fee', transaction.fee ? `${transaction.sourceCurrency} ${transaction.fee}` : 'Free')}
              {renderDetailItem('Total Amount Sent', `${transaction.sourceCurrency} ${transaction.amountSent?.toLocaleString()}`)}
              {renderDetailItem('Reference', transaction.reference)}
              {renderDetailItem('Pre Amount', `${transaction.sourceCurrency} ${transaction.preAmount?.toLocaleString()}`)}
              {renderDetailItem('Post Amount', `${transaction.sourceCurrency} ${transaction.postAmount?.toLocaleString()}`)}
            </View>
          </View>
        </ViewShot>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          width={269}
          gradientColors={['#ee0979', '#ff6a00']}
          title={isCapturing ? 'Processing...' : 'Share Details as Image'}
          onPress={shareImage}
          disabled={isCapturing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  captureContainer: {
    backgroundColor: '#ffffff', // Ensures white background in captured image
    // padding: 20,
  },
  header: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
    color: '#888888',
  },
  detailContainer: {
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  value: {
    fontSize: 14,
    color: '#666666',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  conversionText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
});

export default TransactionDetail;
