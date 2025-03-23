import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { CognitoUser } from "@/types/auth";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

interface AuthState {
  cognitoUser: CognitoUser | null; // holds user data from AWS Cognito
  token: string; // holds token data from AWS Cognito
}

interface AuthActions {
  clearCognitoUser: () => void;
  setCognitoUser: (cognitoUser: CognitoUser) => void;
  setToken: (token: string) => void;
}

const initialState: AuthState = {
  cognitoUser: null,
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
      setCognitoUser: (cognitoUser) =>
        set((state) => {
          state.cognitoUser = cognitoUser;
        }),
      setToken: (token) =>
        set((state) => {
          state.token = token;
        }),
    })),
    {
      name: "auth-storage",
      version: 1,
      storage: expoFileSystemStorage,
    },
  ),
);

middleware(useAuthStore, {
  name: "auth-store",
  version: 1,
});

export default useAuthStore;
