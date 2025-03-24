import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

interface DevState {
  showApiConsoleLogs: boolean;
  showDevToolbox: boolean;
  showPageInfo: boolean;
  showPathnameLog: boolean;
}

interface DevActions {
  toggleShowApiConsoleLogs: () => void;
  toggleShowDevToolbox: () => void;
  toggleShowPageInfo: () => void;
  toggleShowPathnameLog: () => void;
}

const initialState: DevState = {
  showApiConsoleLogs: process.env.NODE_ENV === "development",
  showDevToolbox: process.env.NODE_ENV === "development",
  showPageInfo: process.env.NODE_ENV === "development",
  showPathnameLog: process.env.NODE_ENV === "development",
};

const useDevStore = create<DevState & DevActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      toggleShowApiConsoleLogs: () =>
        set((state) => ({
          showApiConsoleLogs: !state.showApiConsoleLogs,
        })),
      toggleShowDevToolbox: () =>
        set((state) => ({
          showDevToolbox: !state.showDevToolbox,
        })),
      toggleShowPageInfo: () =>
        set((state) => ({
          showPageInfo: !state.showPageInfo,
        })),
      toggleShowPathnameLog: () =>
        set((state) => ({
          showPathnameLog: !state.showPathnameLog,
        })),
    })),
    {
      name: "dev-storage",
      version: 1,
      storage: expoFileSystemStorage,
    },
  ),
);

middleware(useDevStore, {
  name: "dev-store",
  version: 1,
});

export default useDevStore;
