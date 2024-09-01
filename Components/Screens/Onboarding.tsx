import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, SafeAreaView } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import HomeTab from './Assecories/HomeTab';
import data from '../../data/data';
import CustomButton from './Assecories/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '../../navigation';

type DataItem = {
  id: number;
  image: any;
  title: string;
  text: string;
};

export default function Onboarding() {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const x = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<DataItem>>(null);
  const scrollIndex = useRef(0);

  const navigation = useNavigation<ScreenNavigationProp<'SignUp' | 'SignIn'>>();

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const right = interpolate(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [20, SCREEN_WIDTH / 2, 20],
      Extrapolate.CLAMP
    );

    return {
      right,
    };
  });

  const flyer2AnimatedStyle = useAnimatedStyle(() => {
    const right = interpolate(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      [30, -20, 30],
      Extrapolate.CLAMP
    );

    return {
      right,
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        scrollIndex.current = (scrollIndex.current + 1) % data.length;
        flatListRef.current.scrollToIndex({
          index: scrollIndex.current,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const RenderItem: React.FC<{ item: DataItem; index: number }> = ({ item, index }) => {
    const imageAnimatedStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP,
      );
      const translateYAnimated = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        transform: [{ translateY: translateYAnimated }],
      };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolate.CLAMP,
      );
      const translateYAnimated = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolate.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        transform: [{ translateY: translateYAnimated }],
      };
    });

    return (
      <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
        <Animated.Image
          source={item.image}
          style={imageAnimatedStyle}
        />
        <Animated.View style={[textAnimatedStyle, {paddingHorizontal: 0}]}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemText}>{item.text}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <HomeTab />
      <Animated.View style={[styles.absoluteImageContainer, containerAnimatedStyle]}>
        <Animated.Image source={require("../../assets/MappleApp/onboardingSliderImage/flyer2.png")} style={[styles.absoluteImage, styles.flyer2, flyer2AnimatedStyle]} />
        <Image source={require("../../assets/MappleApp/onboardingSliderImage/flyer1.png")} style={styles.absoluteImage} />
      </Animated.View>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        onScroll={onScroll}
        renderItem={({ item, index }) => <RenderItem item={item} index={index} />}
        keyExtractor={item => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          width={169}
          gradientColors={['#ee0979', '#ff6a00']}
          title="Create Account"
          onPress={() => navigation.navigate('SignUp')}
        />
        <CustomButton
          width={169}
          backgroundColor="#0E314C"
          title="Log In"
          onPress={() => navigation.navigate('SignIn')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: '15%',
    marginHorizontal: 25
  },
  itemText: {
    color: '#494D55',
    textAlign: 'left',
    lineHeight: 20,
    fontSize: 14,
    width: "auto"
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 10,
    gap: 20,
    marginBottom: '15%',
    marginHorizontal: 25
  },
  itemContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    // alignItems: 'center',
  },
  itemTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'semibold',
    textAlign: 'left',
    marginBottom: 10,
  },
  paginationWrapper: {
    position: 'absolute',
    bottom: '20%',
    left: '0%',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  absoluteImageContainer: {
    position: 'absolute',
    right: 20,
    top: 70,
    zIndex: 10,
  },
  absoluteImage: {
    margin: 2,
  },
  flyer2: {
    right: 30,
  },
});
