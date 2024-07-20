import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, Image } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import trans from '../../../../assets/MappleApp/trans.png';


interface ModalProps6 {
  isVisible: boolean;
  onClose: () => void;
  onVerifyAccount: () => void;
}

const limitsInfo = [
  {
    id: 1,
    flag: trans,
    title: '24-Hours Limit:',
    limit: '$10,000.00',
    available: 'Available: $10,000.00',
    progress: '100%',
  },
  {
    id: 2,
    flag: trans,
    title: '7-Days Limit:',
    limit: '$20,000.00',
    available: 'Available: $20,000.00',
    progress: '100%',
  },
  {
    id: 3,
    flag: trans,
    title: '30-Days Limit:',
    limit: '$50,000.00',
    available: 'Available: $31,000.00',
    progress: '70%',
  },
];

const Modal7: React.FC<ModalProps6> = ({ isVisible, onClose, onVerifyAccount }) => {
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
                  <Text style={styles.modalTitle}>Transaction Limit</Text>
                  <Text style={styles.modalText}>
                    Please be aware that your sending limit is the maximum amount of money you can send using interac e-Transfer based on a 24 hours, 7 days and a 30 days time period.
                  </Text>
                  {limitsInfo.map((limit) => (
                    <View key={limit.id} style={styles.deviceContainer}>
                      <View style={styles.row}>
                        <Image source={limit.flag} style={styles.flagImage} />
                        <View style={styles.textContainer}>
                          <Text style={styles.deviceTitle}>{limit.title} {limit.limit}</Text>
                          <Text style={styles.availableText}>{limit.available}</Text>
                          <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, { width: limit.progress === '100%' ? '100%' : '70%' }]} />
                            <Text style={styles.progressText}>{limit.progress}</Text>
                          </View>
                        </View>
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
    fontWeight: '500',
    marginTop: 10,
    letterSpacing: 2
  },
  modalText: {
    fontSize: 12.5,
    color: 'grey',
    textAlign: 'left',
    marginTop: 10,
    lineHeight: 18
  },
  deviceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#d9d9d9',
    borderWidth: 1,
    padding: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  flagImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  deviceTitle: {
    fontSize: 14,
    fontWeight: "semibold",
  },
  availableText: {
    fontSize: 14,
    color: 'grey',
    paddingVertical: 5
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#47C285',
  },
  progressText: {
    fontSize: 12,
    color: '#747474',
    marginLeft: 5,
  },
});

export default Modal7;
