import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, Platform, ToastAndroid, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import CustomButton from '../CustomButton';
import { DocumentDuplicateIcon } from 'react-native-heroicons/outline';

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

const BottomSheetModal2: React.FC<BottomSheetModalProps> = ({ isVisible, onClose, onVerifyAccount }) => {
  const translateY = React.useRef(new Animated.Value(300)).current;

  const handleCopyAccountDetails = () => {
    const accountDetails = `
      Account Holder: Adaeze Ibekwe
      Account Number: 1234567890
      Bank Name: Sterling Bank
    `;
    Clipboard.setStringAsync(accountDetails);
    if (Platform.OS === 'android') {
      ToastAndroid.show("Account details copied to clipboard", ToastAndroid.SHORT);
    } else {
      Alert.alert("Account details copied to clipboard");
    }
    setAddModalVisible(false);
    onClose();
  };

  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
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
                    <Text style={styles.boxHead}>NGN Account Details</Text>
                    <Text style={styles.boxBody}>
                      Here are your Naira account details.
                    </Text>

                    <Text style={styles.boxTitle}>Account Holder</Text>
                    <Text style={styles.boxText}>
                      Adaeze Ibekwe
                    </Text>

                    <Text style={styles.boxTitle}>Account Number</Text>
                    <Text style={styles.boxText}>
                      1234567890
                    </Text>

                    <Text style={styles.boxTitle}>Bank Name </Text>
                    <Text style={styles.boxText}>
                      Sterling Bank
                    </Text>
                    
                    <View style={styles.buttonContainer}>
                      <DocumentDuplicateIcon size="25" strokeWidth={2} color="#fff" style={{position: "absolute", 
                          left:45, 
                          top:8, 
                          zIndex: 100
                      }}/>
                      <CustomButton
                        width={"100%"}
                        gradientColors={['#ee0979', '#ff6a00']}
                        title="Copy Account Details"
                        onPress={handleCopyAccountDetails}
                      />
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
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    position: "relative"
  },
  boxHead:{
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
  },
  boxBody:{
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
