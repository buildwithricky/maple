import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, Animated, TouchableWithoutFeedback, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { Beneficiary } from './types';

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
          ? beneficiary.interacEmail?.toLowerCase().includes(searchText.toLowerCase())
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
                  placeholder="Search Beneficiary"
                  value={searchText}
                  onChangeText={setSearchText}
                />
                <ScrollView>
                  {filteredBeneficiaries.length > 0 ? (
                    filteredBeneficiaries.map((beneficiary, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.beneficiaryItem}
                        onPress={() => {
                          onSelectBeneficiary(beneficiary);
                          onClose();
                        }}
                      >
                        <Text style={styles.beneficiaryText}>
                          {isInterac ? beneficiary.nickname : beneficiary.AccountName}
                        </Text>
                        <Text style={styles.beneficiarySubText}>
                          {isInterac ? beneficiary.interacEmail : beneficiary.accountNumber}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noResultsText}>No results found</Text>
                  )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#f7f8fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    maxHeight: '60%',
  },
  handleBar: {
    width: 60,
    height: 6,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 3,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  beneficiaryItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  beneficiaryText: {
    fontSize: 17,
    color: '#555',
    fontWeight: '500',
  },
  beneficiarySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  noResultsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default BottomSheetModal8;
