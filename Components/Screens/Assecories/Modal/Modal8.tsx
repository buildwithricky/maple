import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';

interface Beneficiary {
  accountNumber?: string;
  AccountName?: string;
  bankName?: string;
  email?: string;
  tag?: string;
}

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  beneficiaries: Beneficiary[];
  onSelectBeneficiary: (beneficiary: Beneficiary) => void;
  isInterac: boolean;
}

const BottomSheetModal8: React.FC<BottomSheetModalProps> = ({ isVisible, onClose, beneficiaries, onSelectBeneficiary, isInterac }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>(beneficiaries);

  useEffect(() => {
    setFilteredBeneficiaries(
      beneficiaries.filter((beneficiary) =>
        isInterac
          ? beneficiary.email?.toLowerCase().includes(searchText.toLowerCase())
          : beneficiary.accountNumber?.includes(searchText)
      )
    );
  }, [searchText, beneficiaries, isInterac]);

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
    <Modal visible={isVisible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGestureStateChange}>
              <Animated.View style={[styles.modalContainer, { transform: [{ translateY }] }]}>
                <View style={styles.handleBar} />
                <Text style={styles.modalTitle}>Select Beneficiary</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <ScrollView>
                  {filteredBeneficiaries.map((beneficiary, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.beneficiaryItem}
                      onPress={() => {
                        onSelectBeneficiary(beneficiary);
                        onClose();
                      }}
                    >
                      <Text style={styles.beneficiaryText}>
                        {isInterac ? beneficiary.email : beneficiary.accountNumber}
                      </Text>
                      <Text style={styles.beneficiarySubText}>
                        {isInterac ? beneficiary.tag : beneficiary.AccountName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </PanGestureHandler>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '50%',
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 2.5,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  beneficiaryItem: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  beneficiaryText: {
    fontSize: 16,
  },
  beneficiarySubText: {
    fontSize: 14,
    color: '#888',
  },
});

export default BottomSheetModal8;
