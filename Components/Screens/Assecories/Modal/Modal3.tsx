import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, TouchableOpacity, Image } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

// Import local images
import InternationalPassportImage from '../../../../assets/MappleApp/int_icon.png';
import CanadianPassportImage from '../../../../assets/MappleApp/rename_icon.png';
import WorkPermitImage from '../../../../assets/MappleApp/work_icon.png';

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectDocument: (documentType: string) => void;
}

const BottomSheetModal3: React.FC<BottomSheetModalProps> = ({ isVisible, onClose, onSelectDocument }) => {
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
      if (nativeEvent.translationY >  50) {
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
                    <Text style={styles.boxHead}>Document Type</Text>
                    <Text style={styles.boxBody}>Lorem ipsum dolor sit amet, consectetur adipiscing elit</Text>

                    {[
                      { type: 'International Passport', description: 'Lorem ipsum dolor sit amet consectetur', image: InternationalPassportImage },
                      { type: 'Canadian Passport', description: 'Lorem ipsum dolor sit amet consectetur', image: CanadianPassportImage },
                      { type: 'Work Permit', description: 'Lorem ipsum dolor sit amet consectetur', image: WorkPermitImage },
                    ].map((item, index) => (
                      <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => { onSelectDocument(item.type); onClose(); }}>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemTextContainer}>
                          <Text style={styles.itemTitle}>{item.type}</Text>
                          <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
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
    padding: 10,
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
  boxHead: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  boxBody: {
    fontSize: 12,
    marginBottom: 22,
    color: "#494D55"
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 14,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 'medium',
    paddingBottom: 5
  },
  itemDescription: {
    fontSize: 12,
    color: 'grey',
  },
});

export default BottomSheetModal3;
