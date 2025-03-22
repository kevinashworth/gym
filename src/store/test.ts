import { create } from "zustand";
import { middleware } from "zustand-expo-devtools";

interface TestState {
  count: number;
  message: string;
}

interface TestActions {
  setCount: (count: number) => void;
  setMessage: (message: string) => void;
  reset: () => void;
}

const initialState: TestState = {
  count: 0,
  message: "Hello from testing store",
};

const useTestStore = create<TestState & TestActions>()((set) => ({
  ...initialState,
  setCount: (count) =>
    set((state) => ({
      ...state,
      count,
    })),
  setMessage: (message) =>
    set((state) => ({
      ...state,
      message,
    })),
  reset: () => set(initialState),
}));

middleware(useTestStore, {
  name: "test-store",
  version: 1,
});

export default useTestStore;
