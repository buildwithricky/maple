import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

interface ModalProps6 {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

const deviceInfo = [
  {
    id: 1,
    title: 'iPhone 15 Pro (Current Device)',
    date: 'As at Saturday 11th May 2024, 03:05 AM (UTC +01:00)',
  },
  {
    id: 2,
    title: 'MacBook Pro (Previously Signed in Device)',
    date: 'As at Saturday 11th May 2024, 03:05 AM (UTC +01:00)',
  },
];

const Modal6: React.FC<ModalProps6> = ({ isVisible, onClose, onVerifyAccount }) => {
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
                  <Text style={styles.modalTitle}>Devices and Sessions</Text>
                  <Text style={styles.modalText}>
                    As at Saturday 11th May 2024, 03:05 AM (UTC + 01:00)
                  </Text>
                  {deviceInfo.map((device) => (
                    <View key={device.id} style={styles.deviceContainer}>
                      <Text style={styles.deviceTitle}>{device.title}</Text>
                      <Text style={styles.deviceDate}>{device.date}</Text>
                    </View>
                  ))}
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
    paddingBottom: 10,
  },
  modalContainer: {
    width: '92%',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    alignSelf: 'center',
    paddingBottom: 40
  },
  dragHandle: {
    width: 40,
    height: 6,
    borderRadius: 34,
    backgroundColor: '#E8E9EA',
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 23,
    fontWeight: "400",
    marginTop: 10,
  },
  modalText: {
    fontSize: 12.5,
    color: 'grey',
    textAlign: 'left',
    marginTop: 10,
  },
  deviceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#A4A6AA',
    padding: 15,
    marginTop: 10,
    borderWidth: 0.3
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  deviceDate: {
    fontSize: 14,
    color: 'grey',
    marginTop: 8,
  },
});

export default Modal6;
