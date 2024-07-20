import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import CustomButton from '../CustomButton';

interface Modal5Props {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

const Modal5: React.FC<Modal5Props> = ({ isVisible, onClose, onVerifyAccount }) => {
  const translateY = React.useRef(new Animated.Value(300)).current; 

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
                  <Image source={require("../../../../assets/MappleApp/dummy_2.png")} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>Two Factor Verification</Text>
                  <Text style={styles.modalText}>
                    Please ensure that your account's KYC is verified in order to obtain a virtual account for receiving funds into your MaplePay wallet.
                  </Text>
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      width={"100%"}
                      gradientColors={['#ee0979', '#ff6a00']}
                      title="Set Up Now"
                      onPress={onVerifyAccount}
                    />
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
    alignItems: 'center',
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
  modalImage: {
    width: 140,
    height: 140,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "semibold",
    marginTop: 10,
  },
  modalText: {
    fontSize: 12.5,
    color: 'grey',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

export default Modal5;
