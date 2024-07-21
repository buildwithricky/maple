import React, { useEffect } from 'react';
import { Platform, LogBox, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from '../Screens/Onboarding';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  HomeIcon as HomeOutline,
  UserIcon as UserIconOutline,
  ClockIcon as ClockIconOutline,
} from 'react-native-heroicons/outline';
import {
  HomeIcon as HomeSolid,
  UserIcon as UserIconSolid,
  PlusCircleIcon,
  CalendarIcon as CalendarIconSolid,
} from 'react-native-heroicons/solid';
import SignIn from '../Screens/AccountSetUp/SignIn';
import Returning from '../Screens/AccountSetUp/Returning';
import SignUp from '../Screens/AccountSetUp/SignUp';
import EmailVerif from '../Screens/AccountSetUp/SignUp/EmailVerif';
import EmailVerif2 from '../Screens/AccountSetUp/SignUp/EmailVerif2';
import EmailVerif3 from '../Screens/AccountSetUp/SignUp/EmailVerif3';
import CreatePin from '../Screens/AccountSetUp/SignUp/CreatePin';
import CreatePin3 from '../Screens/AccountSetUp/SignUp/CreatePin3';
import Exchange from '../Screens/tabScreens/Exchange';
import NotificationScreen from '../Screens/tabScreens/Notification';
import Settings from '../Screens/tabScreens/Settings';
import Home from '../Screens/tabScreens/Home';
import Reset from '../Screens/AccountSetUp/Reset';
import Reset2 from '../Screens/AccountSetUp/Reset2';
import Reset3 from '../Screens/AccountSetUp/Reset3';
import Reset4 from '../Screens/AccountSetUp/Reset4';
import Verification_01 from '../Screens/ExternalTabs/Verification_01';
import Verification_02 from '../Screens/ExternalTabs/Verification_02';
import Verification_03 from '../Screens/ExternalTabs/Verification_03';
import Verification_04 from '../Screens/ExternalTabs/Verification_04';
import Transactions from '../Screens/ExternalTabs/Transactions';
import Verification_05 from '../Screens/ExternalTabs/Verification_05';
import Add from '../Screens/ExternalTabs/Add';
import Send from '../Screens/ExternalTabs/Send';
import Swap from '../Screens/ExternalTabs/Swap';
import Exchange_2 from '../Screens/ExternalTabs/Exchange_2';
import Exchange2 from './tabicons/Exchange2';
import Exchange1 from './tabicons/Exchange1';
import Notify2 from './tabicons/Notify2';
import Notify1 from './tabicons/Notify1';
import Set2 from './tabicons/Set2';
import Set1 from './tabicons/Set1';
import Interac_1 from '../Screens/ExternalTabs/Interac_1';
import Interac_2 from '../Screens/ExternalTabs/Interac_2';
import Interac_3 from '../Screens/ExternalTabs/Interac_3';
import Interac_4 from '../Screens/ExternalTabs/Interac_4';
import Interac_5 from '../Screens/ExternalTabs/Interac_5';
import Bene_1 from '../Screens/ExternalTabs/Bene_1';
import Bene_2 from '../Screens/ExternalTabs/Bene_2';
import Bene_3 from '../Screens/ExternalTabs/Bene_3';
import New_1 from '../Screens/ExternalTabs/New_1';
import New_2 from '../Screens/ExternalTabs/New_2';
import New_3 from '../Screens/ExternalTabs/New_3';
import New_4 from '../Screens/ExternalTabs/New_4';
import Exchange_3 from '../Screens/ExternalTabs/Exchange_3';
import Exchange_4 from '../Screens/ExternalTabs/Exchange_4';
import Profile from '../Screens/ExternalTabs/Profile';
import AccountVerification from '../Screens/ExternalTabs/AccountVerification';
import Notifications from '../Screens/ExternalTabs/Notifications';
import RateAlerts from '../Screens/ExternalTabs/RateAlerts';
import Transaction from '../Screens/ExternalTabs/Transaction';
import Change from '../Screens/ExternalTabs/Change';
import Change2 from '../Screens/ExternalTabs/Change2';
import Change3 from '../Screens/ExternalTabs/Change3';
import Factor from '../Screens/ExternalTabs/Factor';
import Device from '../Screens/ExternalTabs/Device';
import Pin from '../Screens/ExternalTabs/Pin';
import AccountVerification2 from '../Screens/ExternalTabs/AccountVerification2';
import AccountVerification3 from '../Screens/ExternalTabs/AccountVerification3';



const ios = Platform.OS === 'ios';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const menuIcons = (route, focused) => {
  let icon;

  if (route.name === 'home') {
    icon = focused ? <HomeSolid size="25" color="#1C202B" /> : <HomeOutline size="25" strokeWidth={2} color="#1C202B" />;
  } else if (route.name === 'exchange') {
    icon = focused ? <Exchange1 width="25" height="25"/>  : <Exchange2 width="25" height="25"/>;
  } else if (route.name === 'notification') {
    icon = focused ? <Notify2 width="25" height="25"/> : <Notify1 width="25" height="25"/>;
  } else if (route.name === 'settings') {
    icon = focused ? <Set2 width="25" height="25"/> : <Set1 width="25" height="25"/>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {icon}
      <Text style={{ color: focused ? '#1C202B' : '#8e8e8e', fontSize: 12, marginTop: 2 }}>
        {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
      </Text>
    </View>
  );
};

const tabScreenOptions = {
  headerShown: true,
  headerTintColor: '#000',
  headerTitleStyle: {
    fontWeight: 'medium',
    fontSize: 18,
    paddingBottom: 15
  }
};

function HomeTabs() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => menuIcons(route, focused),
          tabBarStyle: {
            alignItems: 'center',
            backgroundColor: 'white',
            borderTopWidth: 0,
            borderRadius: 105,
            elevation: 5,
          },
          tabBarItemStyle: {
            marginTop: ios ? 20 : 0,
          },
        })}
      >
        <Tab.Screen name="home" component={HomeStackScreen} />
        <Tab.Screen name="exchange" component={Exchange} options={{ ...tabScreenOptions, headerTitle: "Exchange" }} />
        <Tab.Screen name="notification" component={NotificationScreen} options={{ ...tabScreenOptions, headerTitle: "Notification" }} />
        <Tab.Screen name="settings" component={Settings} options={{ ...tabScreenOptions, headerTitle: "Account Settings" }} />
      </Tab.Navigator>
    </View>
  );
}

const HomeStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      {/* <HomeStack.Screen name="Notification" component={Notification} options={{ headerShown: false }} /> */}
    </HomeStack.Navigator>
  );
}

const ProfileStack = createStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Verification" component={Verification} options={{ headerShown: false }} />
      <ProfileStack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <ProfileStack.Screen name="ReferFriend" component={ReferFriend} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Code" component={Code} options={{ headerShown: false }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
    </ProfileStack.Navigator>
  );
}

export default function RootNavigator() {
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
              contentStyle: { backgroundColor: 'white', paddingBottom: 30 },
              headerBackTitleVisible: false,
              headerLeft: (props) => (
                <TouchableOpacity style={{ marginLeft: 20, marginBottom: 20 }} onPress={props.onPress}>
                  <MaterialCommunityIcons name="arrow-left" size={25} color="#000" />
                </TouchableOpacity>
              ),
              headerTitleAlign: 'center',
            }}
          >
          {/* Onboarding Screens */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          {/* returning User Screen */}
          <Stack.Screen name="Returning" component={Returning} options={{ headerShown: false }} />
          {/* Email Verification screens */}
          <Stack.Screen name="EmailVerif" component={EmailVerif} options={{ ...tabScreenOptions, headerTitle: "1 of 2" }} />
          <Stack.Screen name="EmailVerif2" component={EmailVerif2} options={{ headerShown: false }} />
          <Stack.Screen name="EmailVerif3" component={EmailVerif3} options={{ headerShown: false }} />
          <Stack.Screen name="CreatePin" component={CreatePin} options={{ ...tabScreenOptions, headerTitle: "2 of 2" }} />
          <Stack.Screen name="CreatePin3" component={CreatePin3} options={{ headerShown: false }} />
          {/* HomePage after login */}
          <Stack.Screen name="Homepage" component={HomeTabs} options={{ headerShown: false }} />
          {/* Reset pass screen */}
          <Stack.Screen name="Reset" component={Reset} options={{ ...tabScreenOptions, headerTitle: "1 of 4" }} />
          <Stack.Screen name="Reset2" component={Reset2} options={{ ...tabScreenOptions, headerTitle: "2 of 4" }} />
          <Stack.Screen name="Reset3" component={Reset3} options={{ ...tabScreenOptions, headerTitle: "3 of 4" }} />
          <Stack.Screen name="Reset4" component={Reset4}  options={{ ...tabScreenOptions, headerTitle: "4 of 4" }} />
          {/* Account Verification Screens */}
          <Stack.Screen name="Verification_01" component={Verification_01} options={{ ...tabScreenOptions, headerTitle: "1 of 2" }}   />
          <Stack.Screen name="Verification_02" component={Verification_02} options={{ ...tabScreenOptions, headerTitle: "1 of 2" }} />
          <Stack.Screen name="Verification_03" component={Verification_03} options={{headerShown: false}} />
          <Stack.Screen name="Verification_04" component={Verification_04} options={{headerShown: false}} />
          <Stack.Screen name="Verification_05" component={Verification_05} options={{headerShown: false}} />
          {/* Transaction screen */}
          <Stack.Screen name="Transactions" component={Transactions} options={{headerShown: false}} />
          <Stack.Screen name="Add" component={Add} options={{headerShown: false}} />
          <Stack.Screen name="Send" component={Send} options={{ ...tabScreenOptions, headerTitle: "Send Funds" }} />
          <Stack.Screen name="Swap" component={Swap} options={{headerShown: false}} />
          <Stack.Screen name="Interac_1" component={Interac_1} options={{ ...tabScreenOptions, headerTitle: "Send Funds" }} />
          <Stack.Screen name="Interac_2" component={Interac_2} options={{ ...tabScreenOptions, headerTitle: "Send Funds" }} />
          <Stack.Screen name="Interac_3" component={Interac_3} options={{ ...tabScreenOptions, headerTitle: "Transfer Summary" }} />
          <Stack.Screen name="Interac_4" component={Interac_4} options={{ ...tabScreenOptions, headerTitle: "Confirm Transaction" }} />
          <Stack.Screen name="Interac_5" component={Interac_5} options={{headerShown: false}} />
          <Stack.Screen name="Bene_1" component={Bene_1} options={{ ...tabScreenOptions, headerTitle: "Send Funds" }} />
          <Stack.Screen name="Bene_2" component={Bene_2} options={{ ...tabScreenOptions, headerTitle: "Transfer Summary" }} />
          <Stack.Screen name="Bene_3" component={Bene_3} options={{headerShown: false}} />
          <Stack.Screen name="New_1" component={New_1} options={{headerShown: false}} />
          <Stack.Screen name="New_2" component={New_2} options={{headerShown: false}} />
          <Stack.Screen name="New_3" component={New_3} options={{ ...tabScreenOptions, headerTitle: "Confirm Transaction" }} />
          <Stack.Screen name="New_4" component={New_4} options={{headerShown: false}} />
          <Stack.Screen name="Exchange_2" component={Exchange_2} options={{headerShown: false}} />
          <Stack.Screen name="Exchange_3" component={Exchange_3} options={{ ...tabScreenOptions, headerTitle: "Confirm Transaction" }} />
          <Stack.Screen name="Exchange_4" component={Exchange_4} options={{ ...tabScreenOptions, headerTitle: "Confirm Transaction" }} />
          <Stack.Screen name="Profile" component={Profile} options={{ ...tabScreenOptions, headerTitle: "Profile Settings" }}  />
          <Stack.Screen name="AccountVerification" component={AccountVerification} options={{ ...tabScreenOptions, headerTitle: "Two Factor Verification" }} />
          <Stack.Screen name="AccountVerification2" component={AccountVerification2} options={{ ...tabScreenOptions, headerTitle: "Two Factor Verification" }} />
          <Stack.Screen name="AccountVerification3" component={AccountVerification3} options={{ ...tabScreenOptions, headerTitle: "Two Factor Verification" }} />
          <Stack.Screen name="Notifications" component={Notifications} options={{headerShown: false}} />
          <Stack.Screen name="RateAlerts" component={RateAlerts} options={{ ...tabScreenOptions, headerTitle: "Our Rates" }} />
          <Stack.Screen name="Transaction" component={Transaction} options={{headerShown: false}} />
          <Stack.Screen name="Change" component={Change} options={{ ...tabScreenOptions, headerTitle: "1 of 2" }} />
          <Stack.Screen name="Factor" component={Factor} options={{headerShown: false}} />
          <Stack.Screen name="Device" component={Device} options={{ ...tabScreenOptions, headerTitle: "Devices and Sessions" }} />
          <Stack.Screen name="Pin" component={Pin} options={{ ...tabScreenOptions, headerTitle: "Change Password" }} />
          <Stack.Screen name="Change2" component={Change2} options={{ ...tabScreenOptions, headerTitle: "2 of 2" }} />
          <Stack.Screen name="Change3" component={Change3} options={{headerShown: false}} />
          {/* <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20, 
    zIndex: 1,
  },
});