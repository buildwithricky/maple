import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Easing, Image, LayoutChangeEvent } from 'react-native';
import CustomText from '../../CustomFont/CustomText';

interface HomeTabProps {
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ selectedCurrency = 'NGN', onCurrencyChange = () => {} }) => {
  const [isToggled, setIsToggled] = useState(selectedCurrency === 'NGN');
  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (containerWidth > 0) {
      Animated.timing(translateX, {
        toValue: isToggled ? containerWidth / 2 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isToggled, containerWidth]);

  const toggleButton = () => {
    const newCurrency = isToggled ? 'CAD' : 'NGN';
    setIsToggled(!isToggled);
    onCurrencyChange(newCurrency);
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const buttonWidth = containerWidth / 2;

  return (
    <View style={styles.sliderContainer} onLayout={onLayout}>
      <TouchableOpacity
        style={styles.sliderBackground}
        activeOpacity={1}
        onPress={toggleButton}
      >
        <View style={[styles.sideContainer, isToggled ? styles.offContainer : styles.onContainer]}>
          <Image source={isToggled ? require('../../../assets/MappleApp/canada.png') : require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon} />
          <CustomText style={styles.sideText}>{isToggled ? 'Canadian Dollar ' : 'Nigerian Naira'}</CustomText>
        </View>
        <View style={[styles.sideContainer, isToggled ? styles.onContainer : styles.offContainer]}>
          <Image source={isToggled ? require('../../../assets/MappleApp/canada.png') : require('../../../assets/MappleApp/Nigeria.png')} style={styles.icon} />
          <CustomText style={styles.sideText}>{isToggled ? 'Canadian Dollar ' : 'Nigerian Naira'}</CustomText>
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.sliderButton, { width: buttonWidth, transform: [{ translateX }] }]}>
        <TouchableOpacity style={styles.button} onPress={toggleButton} activeOpacity={1}>
          <Image source={isToggled ? require('../../../assets/MappleApp/Nigeria.png') : require('../../../assets/MappleApp/canada.png')} style={styles.icon} />
          <CustomText style={styles.buttonText}>{isToggled ? 'Nigerian Naira' : 'Canadian Dollar '}</CustomText>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 50,
    backgroundColor: '#E8E9EA',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    padding: 10,
    alignContent: 'center',
  },
  sliderBackground: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  sideContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  onContainer: {
    justifyContent: 'center',
    paddingRight: 10,
    opacity: 0.5,
  },
  offContainer: {
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    opacity: 0.5,
  },
  sliderButton: {
    position: 'absolute',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    borderColor: "#E8E9EA",
    borderWidth: 0.5,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  sideText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default HomeTab;
