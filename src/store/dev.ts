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

interface DevState {
  // for development
  showApiConsoleLogs: boolean;
  showDevToolbox: boolean;
  showPageInfo: boolean;
  showPathnameLog: boolean;
  // for testing the store
  count: number;
  message: string;
}

interface DevActions {
  // for development
  toggleShowApiConsoleLogs: () => void;
  toggleShowDevToolbox: () => void;
  toggleShowPageInfo: () => void;
  toggleShowPathnameLog: () => void;
  // for testing the store
  setCount: (count: number) => void;
  setMessage: (message: string) => void;
  reset: () => void;
}

const initialState: DevState = {
  showApiConsoleLogs: false,
  showDevToolbox: false,
  showPageInfo: false,
  showPathnameLog: process.env.NODE_ENV === "development",
  count: 0,
  message: "Hello from testing store",
};

const useDevStore = create<DevState & DevActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      reset: () => set(initialState),
      setCount: (count) =>
        set((state) => ({
          count,
        })),
      setMessage: (message) =>
        set((state) => ({
          message,
        })),
      toggleShowApiConsoleLogs: () =>
        set((state) => ({
          showApiConsoleLogs:
            process.env.NODE_ENV === "development" ? !state.showApiConsoleLogs : false,
        })),
      toggleShowDevToolbox: () =>
        set((state) => ({
          showDevToolbox: process.env.NODE_ENV === "development" ? !state.showDevToolbox : false,
        })),
      toggleShowPageInfo: () =>
        set((state) => ({
          showPageInfo: process.env.NODE_ENV === "development" ? !state.showPageInfo : false,
        })),
      toggleShowPathnameLog: () =>
        set((state) => ({
          showPathnameLog: process.env.NODE_ENV === "development" ? !state.showPathnameLog : false,
        })),
    })),
    {
      name: "dev-storage",
      version: 1,
      storage: getStorageOption(),
    }
  )
);

middleware(useDevStore);

export default useDevStore;
