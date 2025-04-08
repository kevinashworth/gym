import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { CognitoUser } from "@/types/auth";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

const getStorageOption = () => {
  if (Platform.OS === "web") {
    return createJSONStorage(() => localStorage); // this is the default, use localStorage for web
  }
  return expoFileSystemStorage;
};

interface AuthState {
  account: string; // holds the email address between collect-account and verify-account
  cognitoUser: CognitoUser | null; // holds user data from AWS Cognito
  tempMessage: string; // holds temporary message  while signing up, recovering, etc.
  tempUser: any; // holds temporary user data from AWS Cognito while signing up, recovering, etc.
  token: string; // holds token data from AWS Cognito
}

interface AuthActions {
  clearCognitoUser: () => void;
  resetAuth: () => void;
  setAccount: (account: string) => void;
  setCognitoUser: (cognitoUser: CognitoUser) => void;
  setTempMessage: (tempMessage: string) => void;
  setTempUser: (tempUser: any) => void;
  setToken: (token: string) => void;
}

const initialState: AuthState = {
  account: "",
  cognitoUser: null,
  tempMessage: "",
  tempUser: null,
  token: "",
};

const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      clearCognitoUser: () =>
        set((state) => {
          state.cognitoUser = null;
        }),
      resetAuth: () => set(initialState),
      setAccount: (account) =>
        set((state) => {
          state.account = account;
        }),
      setCognitoUser: (cognitoUser) =>
        set((state) => {
          state.cognitoUser = cognitoUser;
        }),
      setTempMessage: (tempMessage) =>
        set((state) => {
          state.tempMessage = tempMessage;
        }),
      setTempUser: (tempUser) =>
        set((state) => {
          state.tempUser = tempUser;
        }),
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),
    })),
    {
      name: "auth-storage",
      version: 1,
      storage: getStorageOption(),
    }
  )
);

middleware(useAuthStore);

export default useAuthStore;

// const typicalAuthSignUpResult = {
//   "codeDeliveryDetails": {
//     "AttributeName": "email",
//     "DeliveryMedium": "EMAIL",
//     "Destination": "k***@g***"
//   },
//   "user": {
//     "Session": null,
//     "authenticationFlowType": "USER_SRP_AUTH",
//     "client": {
//       "endpoint": "https://cognito-idp.us-west-2.amazonaws.com/",
//       "fetchOptions": [Object]
//     },
//     "keyPrefix": "CognitoIdentityServiceProvider.37nmv578r4kfp36bfq5h1d26ha",
//     "pool": {
//       "advancedSecurityDataCollectionFlag": true,
//       "client": [Client],
//       "clientId": "37nmv578r4kfp36bfq5h1d26ha",
//       "storage": [Function MemoryStorage],
//       "userPoolId": "us-west-2_L7xR4E7Yc",
//       "wrapRefreshSessionCallback": [Function anonymous]},
//       "signInUserSession": null,
//       "storage": [Function MemoryStorage],
//       "userDataKey": "CognitoIdentityServiceProvider.37nmv578r4kfp36bfq5h1d26ha.kashworth+brogue@gotyou.co.userData",
//       "username": "kashworth+brogue@gotyou.co"
//     },
//     "userConfirmed": false,
//     "userSub": "418c9439-5171-4faa-9067-d81bf135d120"
//   };
// console.log(typicalAuthSignUpResult)
