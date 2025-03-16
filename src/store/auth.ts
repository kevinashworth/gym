import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer'

import { isValidMobilePhone } from "@/utils/phone";

interface AuthState {
  cognitoUser: any;
  user: any;
  tempUser: any;
  isMobile: boolean;
  resendConfirmCodeTimestamp: Date | null;
  signInState: {
    loading: boolean;
    error: string | undefined;
  };
  signUpState: {
    collectAccount: {
      loading: boolean;
      valid: boolean;
      error: string | null;
    };
    verifyAccount: {
      loading: boolean;
      valid: boolean;
      error: string | null;
    };
    collectInfo: {
      loading: boolean;
      valid: boolean;
      error: string | null;
    };
    resend: {
      loading: boolean;
      error: string | null;
    };
    verifyCode: {
      loading: boolean;
      error: string | null;
    };
  };
  recoveryState: {
    recoveryApply: {
      loading: boolean;
      error: string | null;
    };
    recoverySubmit: {
      loading: boolean;
      error: string | null;
    };
  };
}

interface AuthActions {
  signIn: ({ account, password }: { account: string; password: string }) => void;
}

const initialState: AuthState = {
  cognitoUser: null,
  user: void 0,
  tempUser: null,
  isMobile: false,
  resendConfirmCodeTimestamp: null,
  signInState: {
    loading: false,
    error: void 0,
  },
  signUpState: {
    collectAccount: {
      loading: false,
      valid: false,
      error: null,
    },
    verifyAccount: {
      loading: false,
      valid: false,
      error: null,
    },
    collectInfo: {
      loading: false,
      valid: false,
      error: null,
    },
    resend: {
      loading: false,
      error: null,
    },
    verifyCode: {
      loading: false,
      error: null,
    },
  },
  recoveryState: {
    recoveryApply: {
      loading: false,
      error: null,
    },
    recoverySubmit: {
      loading: false,
      error: null,
    },
  },
};

// account and password come from sign-in form; account could be email or phone number
function signIn({ account, password }) {
  const isMobile = isValidMobilePhone(account);
  actions.set((state) => {
    state.signInState.loading = true;
    state.signInState.error = void 0;
    state.isMobile = isMobile;
  });
  try {
    const user = await Auth.signIn(account, password);
    const accessToken = user.signInUserSession.accessToken.jwtToken;
    const idToken = user.signInUserSession.idToken.jwtToken;
    const { data, error } = await fetchToken({
      access_token: accessToken,
      id_token: idToken,
    });
    if (error) {
      throw new Error(error);
    }

    actions.set((state) => {
      state.cognitoUser = user;
      state.user = { ...user, ...data };
    });
  } catch (error) {
    actions.set(
      (state) =>
        void (state.signInState.error = String(error.message || error)),
    );
  }
  actions.set((state) => void (state.signInState.loading = false));
}),

const envAwareDevtools = (
  process.env.NODE_ENV === "production" ? (f) => f : devtools
) as typeof devtools;

const useAuthStore = create<AuthState & AuthActions>()(
  envAwareDevtools(
    persist(
      immer((set) => ({
        ...initialState,
        signIn: () => {
          console.log("signIn");
        },
      })),
      { name: "auth-storage", version: 1 },
    ),
    { name: "Auth Store" },
  ),
);

export default useAuthStore;
