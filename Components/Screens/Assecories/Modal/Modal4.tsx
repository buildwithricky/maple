import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Import local images
import CanadianFlag from '../../../../assets/MappleApp/canada.png';
import NigeriaFlag from '../../../../assets/MappleApp/Nigeria.png';

interface ModalProps6 {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

type IconName = "text" | "arrow-forward";

interface DeviceInfoItem {
  id: string;
  image?: any; // Replace with correct type if known
  icon?: IconName; // Restrict to predefined Ionicons names
  text: string;
  bold?: boolean;
}

const deviceInfo = [
  {
    id: '1',
    title: 'Canadian Dollar',
    firstRow: [
      { id: 'canadaFlag', image: CanadianFlag, text: 'CAD' },
      { id: 'arrow', icon: 'arrow-forward' as IconName },
      { id: 'nigeriaFlag', image: NigeriaFlag, text: 'NGN' },
      { id: 'exchangeRate', text: '1 CAD = 800 NGN', bold: true },
    ],
  },
  {
    id: '2',
    title: 'Nigerian Naira',
    firstRow: [
      { id: 'canadaFlag', image: CanadianFlag, text: 'CAD' },
      { id: 'arrow', icon: 'arrow-forward' as IconName },
      { id: 'nigeriaFlag', image: NigeriaFlag, text: 'NGN' },
      { id: 'exchangeRate', text: '1 NGN = 0.0011 CAD', bold: true },
    ],
  },
];

const Modal4: React.FC<ModalProps6> = ({ isVisible, onClose, onVerifyAccount }) => {
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
                  <Text style={styles.modalTitle}>Exchange Rates</Text>
                  <Text style={styles.modalText}>
                    As at Saturday 11th May 2024, 03:05 AM (UTC + 01:00)
                  </Text>
                  {deviceInfo.map((device) => (
                    <View key={device.id} style={styles.deviceContainer}>
                      <View style={styles.row}>
                        {device.id === '1' && <Image source={CanadianFlag} style={styles.flagImage} />}
                        {device.id === '2' && <Image source={NigeriaFlag} style={styles.flagImage} />}
                        <Text style={styles.deviceTitle}>{device.title}</Text>
                      </View>
                      <View style={styles.row}>
                        {device.firstRow.map((item) => (
                          <React.Fragment key={item.id}>
                            {item.image && <Image source={item.image} style={styles.flagImage} />}
                            {item.icon && <Ionicons name={item.icon} size={20} style={styles.icon} />}
                            <Text style={[styles.text, item.bold && styles.boldText]}>{item.text}</Text>
                          </React.Fragment>
                        ))}
                      </View>
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
    fontWeight: '400',
    marginTop: 10,
  },
  modalText: {
    fontSize: 12.5,
    color: 'grey',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10
  },
  deviceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    paddingHorizontal: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },
  flagImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  text: {
    fontSize: 14,
  },
  boldText: {
    fontWeight: '300',
    paddingLeft: 50
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: '300',
    paddingVertical: 10,
  },
});

export default Modal4;
