import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, Platform, ToastAndroid, Alert, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import CustomButton from '../CustomButton';
import { DocumentDuplicateIcon } from 'react-native-heroicons/outline';
import { API_URl } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { ScreenNavigationProp } from '../../../../navigation';
import { useNavigation } from '@react-navigation/native';

interface AccountInformation {
  accountNumber: string;
  accountName: string;
  bankName: string;
  reference: string;
  _id: string;
}

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

const BottomSheetModal2: React.FC<BottomSheetModalProps> = ({ isVisible, onClose, onVerifyAccount }) => {
  const translateY = React.useRef(new Animated.Value(300)).current;
  const [accountDetails, setAccountDetails] = useState<AccountInformation | null>(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const navigation = useNavigation<ScreenNavigationProp<'Interac_1'>>();

  const fetchAccountDetails = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_URl}/wallet/user/ngn`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      if (result.success) {
        setAccountDetails(result.data.accountInformation);
      } else {
        throw new Error(result.message || 'Failed to fetch account details');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch account details error:', error.message);
      } else {
        console.error('Fetch account details error:', error);
      }
      if (Platform.OS === 'android') {
        ToastAndroid.show("Failed to fetch account details", ToastAndroid.SHORT);
      } else {
        Alert.alert("Failed to fetch account details");
      }
    }
  };

  const handleCopyAccountDetails = () => {
    if (accountDetails) {
      const details = `
        Account Holder: ${accountDetails.accountName}
        Account Number: ${accountDetails.accountNumber}
        Bank Name: ${accountDetails.bankName}
      `;
      Clipboard.setStringAsync(details);
      if (Platform.OS === 'android') {
        ToastAndroid.show("Account details copied to clipboard", ToastAndroid.SHORT);
      } else {
        Alert.alert("Account details copied to clipboard");
      }
      setAddModalVisible(false);
      onClose();
    }
  };

  const handleShowCadDetails = () => {
    navigation.navigate('Interac_1')
    setAddModalVisible(false);
    onClose();
  }

  useEffect(() => {
    if (isVisible) {
      fetchAccountDetails();
      translateY.setValue(300);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleGestureStateChange = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationY > 150) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View style={styles.modalOverlay}>
              <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGestureStateChange}>
                <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                  <View style={styles.dragHandle} />
                  <View style={styles.modalContainer}>
                  <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={26} color="black" />
                  </TouchableOpacity>
                    <Text style={styles.boxHead}>NGN Account Details</Text>
                    <Text style={styles.boxBody}>
                      Here are your Naira account details.
                    </Text>

                    {accountDetails ? (
                      <>
                        <Text style={styles.boxTitle}>Account Holder</Text>
                        <Text style={styles.boxText}>
                          {accountDetails.accountName}
                        </Text>

                        <Text style={styles.boxTitle}>Account Number</Text>
                        <Text style={styles.boxText}>
                          {accountDetails.accountNumber}
                        </Text>

                        <Text style={styles.boxTitle}>Bank Name</Text>
                        <Text style={styles.boxText}>
                          {accountDetails.bankName}
                        </Text>
                      </>
                    ) : (
                      <Text>Loading...</Text>
                    )}
                    <View style={styles.buttonContainer}>
                      <DocumentDuplicateIcon size="25" strokeWidth={2} color="#fff" style={{ position: "absolute", left: 30, top: 8, zIndex: 100 }} />
                      <CustomButton
                        width={"100%"}
                        gradientColors={['#ee0979', '#ff6a00']}
                        title="Copy Account Details"
                        onPress={handleCopyAccountDetails}
                      />
                    </View>
                      <View style={{marginTop: 20}}>
                      <Text style={styles.boxHead}>Fund CAD Account</Text>
                      <Text style={styles.boxBody}>
                        By clicking the button below, you'll be redirected to a page where you can fund your CAD account.
                      </Text>
                      <View style={{display: "flex", flexDirection:"row", justifyContent: "center"}}>
                        <CustomButton
                          width={"100%"}
                          gradientColors={['#ee0979', '#ff6a00']}
                          title="Click Here to Fund CAD Account"
                          onPress={handleShowCadDetails}
                        />
                      </View>
                    </View>
                  </View>
                </Animated.View>
              </PanGestureHandler>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingBottom: 10
  },
  modalContainer: {
    width: '92%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignItems: "flex-start",
    alignSelf: 'center',
  },
  dragHandle: {
    width: 40,
    height: 6,
    borderRadius: 34,
    backgroundColor: '#E8E9EA',
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    position: "relative"
  },
  boxHead: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  boxBody: {
    fontSize: 12,
    color: 'grey',
    marginBottom: 17,
  },
  boxTitle: {
    fontSize: 12,
    color: 'grey',
    lineHeight: 20
  },
  boxText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 19,
  }
});

export default BottomSheetModal2;
