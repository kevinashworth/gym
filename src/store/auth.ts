import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { middleware } from "zustand-expo-devtools";

import { CognitoUser } from "@/types/auth";

import { expoFileSystemStorage } from "./expoFileSystemStorage";

// import { isValidMobilePhone } from "@/utils/phone";

interface AuthState {
  cognitoUser: CognitoUser | null; // holds user data from AWS Cognito
  token: string; // holds token data from AWS Cognito
  // user: any; // holds the `gotme` data: uuid, date_joined, merchants, locations, token_balance, otc_redeemed, staff
  // // isTokenLoading: boolean;
  // // isAuthenticated: boolean;
  // // user: any; // is set to cognitoUser plus token data
  // tempUser: any; // is used temporarily for confirm sign up code then set to null
  // isMobile: boolean;
  // resendConfirmCodeTimestamp: Date | null;
  // signInState: {
  //   loading: boolean;
  //   error: string | undefined;
  // };
  // signUpState: {
  //   collectAccount: {
  //     loading: boolean;
  //     valid: boolean;
  //     error: string | null;
  //   };
  //   verifyAccount: {
  //     loading: boolean;
  //     valid: boolean;
  //     error: string | null;
  //   };
  //   collectInfo: {
  //     loading: boolean;
  //     valid: boolean;
  //     error: string | null;
  //   };
  //   resend: {
  //     loading: boolean;
  //     error: string | null;
  //   };
  //   verifyCode: {
  //     loading: boolean;
  //     error: string | null;
  //   };
  // };
  // recoveryState: {
  //   recoveryApply: {
  //     loading: boolean;
  //     error: string | null;
  //   };
  //   recoverySubmit: {
  //     loading: boolean;
  //     error: string | null;
  //   };
  // };
}

interface AuthActions {
  clearCognitoUser: () => void;
  setCognitoUser: (cognitoUser: CognitoUser) => void;
  setToken: (token: string) => void;
  // setUser: (user: any) => void;
  // signIn: ({ account, password }: { account: string; password: string }) => void;
}

const initialState: AuthState = {
  cognitoUser: null,
  token: "",
  // user: null,
  // tempUser: null,
  // isMobile: false,
  // resendConfirmCodeTimestamp: null,
  // signInState: {
  //   loading: false,
  //   error: void 0,
  // },
  // signUpState: {
  //   collectAccount: {
  //     loading: false,
  //     valid: false,
  //     error: null,
  //   },
  //   verifyAccount: {
  //     loading: false,
  //     valid: false,
  //     error: null,
  //   },
  //   collectInfo: {
  //     loading: false,
  //     valid: false,
  //     error: null,
  //   },
  //   resend: {
  //     loading: false,
  //     error: null,
  //   },
  //   verifyCode: {
  //     loading: false,
  //     error: null,
  //   },
  // },
  // recoveryState: {
  //   recoveryApply: {
  //     loading: false,
  //     error: null,
  //   },
  //   recoverySubmit: {
  //     loading: false,
  //     error: null,
  //   },
  // },
};

// account and password come from sign-in form; account could be email or phone number
// function signIn({ account, password }) {
//   const isMobile = isValidMobilePhone(account);
//   actions.set((state) => {
//     state.signInState.loading = true;
//     state.signInState.error = void 0;
//     state.isMobile = isMobile;
//   });
//   try {
//     const user = await Auth.signIn(account, password);
//     const accessToken = user.signInUserSession.accessToken.jwtToken;
//     const idToken = user.signInUserSession.idToken.jwtToken;
//     const { data, error } = await fetchToken({
//       access_token: accessToken,
//       id_token: idToken,
//     });
//     if (error) {
//       throw new Error(error);
//     }

//     actions.set((state) => {
//       state.cognitoUser = user;
//       state.user = { ...user, ...data };
//     });
//   } catch (error) {
//     actions.set(
//       (state) =>
//         void (state.signInState.error = String(error.message || error)),
//     );
//   }
//   actions.set((state) => void (state.signInState.loading = false));
// }),

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
      // setUser: (user) =>
      //   set((state) => {
      //     state.user = user;
      //   }),
      // signIn: () => {
      //   console.log("signIn");
      // },
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
