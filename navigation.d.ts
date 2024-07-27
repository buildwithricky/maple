// types/navigation.d.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  Returning: undefined;
  SignUp: undefined;
  EmailVerif: undefined;
  EmailVerif2: undefined;
  EmailVerif3: undefined;
  CreatePin: undefined;
  CreatePin2: undefined;
  CreatePin3: undefined;
  Homepage: undefined;
  Reset: undefined;
  Reset2: undefined;
  Reset3: undefined;
  Reset4: undefined;
  Reset5: undefined;
  Transactions: undefined;
  notification: undefined;
  Verification_01: undefined;
  Home: undefined;
  Send: undefined;
  Swap: undefined;
  Exchange_2: undefined;
  Exchange_3: undefined;
  CreatePin3: undefined;
  Exchange_4: undefined;
  Profile: undefined;
  RateAlerts: undefined;
  Transaction: undefined;
  Pin: undefined;
  AccountVerification: undefined;
  Device: undefined;
  Device2: undefined;
  Change: undefined;
  Change3: undefined;
  Change2: undefined;
  settings: undefined;
  AccountVerification2: undefined;
  AccountVerification3: undefined;
  Interac_1: undefined;
  Interac_2: undefined;
  Bene_1: undefined;
  Bene_2: undefined;
  New_1: undefined;
  // Add other routes as needed
};

export type ScreenNavigationProp<Screen extends keyof RootStackParamList> = StackNavigationProp<
  RootStackParamList,
  Screen
>;

export type ScreenRouteProp<Screen extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  Screen
>;
