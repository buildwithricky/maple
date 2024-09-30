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
  Transaction: undefined;
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
  Interac_3: undefined;
  Interac_4: undefined;
  Interac_5: undefined;
  Bene_1: undefined;
  Bene_2: undefined;
  Bene_3: undefined;
  Bene_4: undefined;
  New_1: undefined;
  Verification_02: undefined;
  PhoneVerif2: undefined;
  PhoneVerif: undefined;
  BVNverif2: undefined;
  BVNverif: undefined;
  BVNverif3: undefined;
  TransactionsList: undefined
  CADLimits: undefined
  NGNLimits: undefined
  wtwTransfer1: undefined
  wtwTransfer2: undefined
  wtwTransfer3: undefined
  wtwTransfer4: undefined
  twoFA: undefined
  NotificationDes: { notification: NotificationType }
  TransactionDetail: { transaction: TransactionType };
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
