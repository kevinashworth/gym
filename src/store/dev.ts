import { create } from "zustand";
import { persist } from "zustand/middleware";
import { middleware } from "zustand-expo-devtools";

interface DevState {
  enableDevToolbox: boolean;
}

interface DevActions {
  toggleEnableDevToolbox: () => void;
}

const initialState: DevState = {
  enableDevToolbox: false,
  // enableDevToolbox: process.env.NODE_ENV === "development",
};

const useDevStore = create<DevState & DevActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleEnableDevToolbox: () =>
        set((state) => ({
          ...state,
          enableDevToolbox: !state.enableDevToolbox,
        })),
    }),
    {
      name: "dev-storage",
      version: 1,
    },
  ),
);

middleware(useDevStore, {
  name: "dev-store",
  version: 1,
});

export default useDevStore;
