import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface DevState {
  enableDevToolbox: boolean;
}

interface DevActions {
  toggleEnableDevToolbox: () => void;
}

const initialState: DevState = {
  enableDevToolbox: process.env.NODE_ENV === "development",
};

const envAwareDevtools = (
  process.env.NODE_ENV === "production" ? (f) => f : devtools
) as typeof devtools;

const useDevStore = create<DevState & DevActions>()(
  envAwareDevtools(
    persist(
      (set, get) => ({
        ...initialState,
        toggleEnableDevToolbox: () =>
          set(
            (state) => ({
              ...state,
              enableDevToolbox: !state.enableDevToolbox,
            }),
            false,
            "dev/toggleEnableDevToolbox",
          ),
      }),
      {
        name: "dev-storage",
        version: 1,
      },
    ),
    { name: "Dev Store" },
  ),
);

export default useDevStore;
