import { View, Text, ScrollView, SafeAreaView, Image, StyleSheet } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';

interface SuccessPageProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ title, subtitle, buttonText, buttonAction }) => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.contentContainer}>
          <Image source={require("../../../assets/MappleApp/icon_check.png")} style={styles.image} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <CustomButton
            width={"95%"}
            gradientColors={['#ee0979', '#ff6a00']}
            title={buttonText}
            onPress={buttonAction}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  image: {
    marginTop: 70,
    width: 88,
    marginBottom: -100,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 9,
  },
  subtitle: {
    fontSize: 14,
    color: 'grey',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 10
  },
});

export default SuccessPage;
