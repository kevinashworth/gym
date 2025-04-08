import { Platform } from "react-native";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

const getStorageOption = () => {
  if (Platform.OS === "web") {
    return createJSONStorage(() => localStorage); // this is the default, use localStorage for web
  }
  return expoFileSystemStorage;
};

interface GotMe {
  uuid: string;
  date_joined: string;
  merchants: {
    uuid: string;
    name: string;
  }[];
  locations: {
    uuid: string;
    name: string;
    nickname: string;
    verified: string | null;
    address1: string;
    city: string;
    state: string;
    zip: string;
  }[];
  token_balance: number;
  otc_redeemed: boolean;
  staff: boolean;
}

interface UserState {
  attributes: {
    sub: string;
    email: string; // we only use email for now
    email_verified: boolean;
  };
  authToken: string;
  gotme: GotMe;
  locationUuid: string;
  merchantUuid: string;
}

interface UserActions {
  resetUser: () => void;
  setAttributes: (attributes: UserState["attributes"]) => void;
  setAuthToken: (authToken: string) => void;
  setGotme: (gotme: GotMe) => void;
  setLocationUuid: (locationUuid: string) => void;
  setMerchantUuid: (merchantUuid: string) => void;
}

const initialState: UserState = {
  attributes: {
    sub: "",
    email: "",
    email_verified: false,
  },
  authToken: "",
  gotme: {
    uuid: "",
    date_joined: "",
    merchants: [],
    locations: [],
    token_balance: 0,
    otc_redeemed: false,
    staff: false,
  },
  locationUuid: "",
  merchantUuid: "",
};

const useUserStore = create<UserState & UserActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      resetUser: () => set(() => initialState),
      setAttributes: (attributes) =>
        set((state) => {
          state.attributes = attributes;
        }),
      setAuthToken: (authToken) =>
        set((state) => {
          state.authToken = authToken;
        }),
      setGotme: (gotme) =>
        set((state) => {
          state.gotme = gotme;
        }),
      setLocationUuid: (locationUuid) =>
        set((state) => {
          state.locationUuid = locationUuid;
        }),
      setMerchantUuid: (merchantUuid) =>
        set((state) => {
          state.merchantUuid = merchantUuid;
        }),
    })),
    {
      name: "user-storage",
      version: 1,
      storage: getStorageOption(),
    }
  )
);

middleware(useUserStore);

export default useUserStore;
