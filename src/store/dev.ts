import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

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
  showApiConsoleLogs: process.env.NODE_ENV === "development",
  showDevToolbox: process.env.NODE_ENV === "development",
  showPageInfo: process.env.NODE_ENV === "development",
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
      storage: expoFileSystemStorage,
    }
  )
);

middleware(useDevStore, {
  name: "dev-store",
  version: 1,
});

export default useDevStore;
