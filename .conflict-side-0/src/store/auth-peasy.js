import { Auth } from "aws-amplify";
import { persist, action, thunk } from "easy-peasy";
import isMobilePhone from "validator/lib/isMobilePhone";

import { fetchToken, signUp, verifyCode } from "~/service/auth";
import storage from "~/utils/storage";

const getDefaultSignUpState = () => ({
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
});

const getDefaultRecoveryState = () => ({
  recoveryApply: {
    loading: false,
    error: null,
  },
  recoverySubmit: {
    loading: false,
    error: null,
  },
});

const auth = persist(
  {
    cognitoUser: null,
    user: void 0,
    tempUser: null,

    isMobile: false,
    resendConfirmCodeTimestamp: null,

    signInState: {
      loading: false,
      error: void 0,
    },

    signUpState: getDefaultSignUpState(),

    recoveryState: getDefaultRecoveryState(),

    set: action((state, payload) => {
      payload(state);
    }),

    signIn: thunk(async (actions, { account, password }) => {
      const isMobile = isMobilePhone(account);
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
    signOut: thunk((actions, payload, helper) => {
      actions.set((state) => {
        state.cognitoUser = void 0;
        state.user = void 0;
      });
      helper.getStoreActions().user.clear();
    }),

    /** start sign up */
    resetSignUp: thunk((actions) => {
      actions.set((state) => {
        state.tempUser = null;
        state.signUpState = getDefaultSignUpState();
      });
    }),
    signUpCognito: thunk(async (actions, { account, password }, helper) => {
      const isMobile = isMobilePhone(account);
      actions.set((state) => {
        state.isMobile = isMobilePhone(account);
      });
      const valid =
        helper.getStoreState().auth.signUpState.collectAccount.valid;
      if (valid) return true;
      actions.set((state) => {
        state.signUpState.collectAccount = {
          loading: true,
          valid: false,
          error: null,
        };
      });
      try {
        await Auth.signUp({
          username: account,
          password,
          attributes: isMobile
            ? {
                phone_number: account,
              }
            : {
                email: account,
              },
          autoSignIn: {
            enabled: true,
          },
        });
      } catch (error) {
        actions.set((state) => {
          state.signUpState.collectAccount.error = error.message || error;
          state.signUpState.collectAccount.loading = false;
        });
        return false;
      }
      actions.set((state) => {
        state.signUpState.collectAccount.loading = false;
        state.signUpState.collectAccount.valid = true;
      });
      return true;
    }),
    resendConfirmCode: thunk(async (actions, { account }) => {
      actions.set((state) => {
        state.isMobile = isMobilePhone(account);
        state.signUpState.resend = {
          loading: true,
          error: null,
        };
        state.resendConfirmCodeTimestamp = new Date().getTime();
      });
      try {
        await Auth.resendSignUp(account);
      } catch (error) {
        console.warn(error);
        actions.set(
          (state) =>
            void (state.signUpState.resend.error = String(
              error.message || error,
            )),
        );
      }
      actions.set((state) => void (state.signUpState.resend.loading = false));
    }),
    // eslint-disable-next-line no-unused-vars
    confirmCognito: thunk(async (actions, { account, code }, helper) => {
      actions.set((state) => {
        state.isMobile = isMobilePhone(account);
      });
      const valid = helper.getStoreState().auth.signUpState.verifyAccount.valid;
      if (valid) return true;
      actions.set((state) => {
        state.signUpState.verifyAccount = {
          loading: true,
          valid: false,
          error: null,
        };
      });
      try {
        await Auth.confirmSignUp(account, code);
      } catch (error) {
        actions.set((state) => {
          state.signUpState.verifyAccount.error = String(
            error.message || error,
          );
          state.signUpState.verifyAccount.loading = false;
        });

        return false;
      }
      actions.set((state) => {
        state.signUpState.verifyAccount.loading = false;
        state.signUpState.verifyAccount.valid = true;
      });
      return true;
    }),
    signUpGotYou: thunk(
      async (
        actions,
        { username, firstName, lastName, phone, email },
        helper,
      ) => {
        const valid = helper.getStoreState().auth.signUpState.collectInfo.valid;
        const isMobile = helper.getStoreState().auth.isMobile;
        if (valid) return true;
        actions.set((state) => {
          state.signUpState.collectInfo = {
            loading: true,
            valid: false,
            error: null,
          };
        });
        try {
          const user = await Auth.currentAuthenticatedUser();
          const accessToken = user.signInUserSession.accessToken.jwtToken;
          const idToken = user.signInUserSession.idToken.jwtToken;
          const dataset = {
            id_token: idToken,
            access_token: accessToken,
            user_tag: username,
            first_name: firstName,
            last_name: lastName,
          };
          if (isMobile) {
            dataset.email = email;
          } else {
            dataset.phone = phone;
          }

          const { data, error } = await signUp(dataset);
          if (error) {
            throw new Error(error);
          }
          actions.set(
            (state) =>
              void (state.tempUser = {
                cognitoUser: user,
                user: { ...user, ...data },
              }),
          );
        } catch (error) {
          console.warn(error);
          actions.set((state) => {
            state.signUpState.collectInfo.error = String(
              error.message || error,
            );
            state.signUpState.collectInfo.loading = false;
          });

          return false;
        }

        actions.set((state) => {
          state.signUpState.collectInfo.loading = false;
          state.signUpState.collectInfo.valid = true;
        });

        return true;
      },
    ),
    confirmSignUpCode: thunk(async (actions, { code }, helper) => {
      let valid = true;
      const token = helper.getStoreState().auth.tempUser.user.token;
      actions.set((state) => {
        state.signUpState.verifyCode = {
          loading: true,
          error: null,
        };
      });
      const { error } = await verifyCode(
        { code },
        { headers: { Authorization: `Token ${token}` } },
      );
      if (error) {
        valid = false;
        actions.set(
          (state) =>
            void (state.signUpState.verifyCode.error = "Not Acceptable"),
        );
      }
      actions.set(
        (state) => void (state.signUpState.verifyCode.loading = false),
      );
      return valid;
    }),
    signInFormSignUp: thunk((actions, payload, helper) => {
      const userCombine = helper.getStoreState().auth.tempUser;
      actions.set((state) => {
        state.cognitoUser = userCombine.cognitoUser;
        state.user = userCombine.user;
        state.tempUser = null;
      });
    }),
    /** end sign up */

    /** start recovery  */
    recoveryApply: thunk(async (actions, { account }) => {
      try {
        actions.set((state) => {
          state.recoveryState.recoveryApply.loading = true;
          state.recoveryState.recoveryApply.error = null;
        });
        return await Auth.forgotPassword(account);
      } catch (err) {
        actions.set((state) => {
          state.recoveryState.recoveryApply.error = err.message;
        });
      } finally {
        actions.set((state) => {
          state.recoveryState.recoveryApply.loading = false;
        });
      }
    }),
    recoverySubmit: thunk(
      async (actions, { account, code, password }, helper) => {
        try {
          actions.set((state) => {
            state.recoveryState.recoverySubmit.loading = true;
            state.recoveryState.recoverySubmit.error = null;
          });
          const ret = await Auth.forgotPasswordSubmit(account, code, password);
          if (ret === "SUCCESS") {
            await helper.getStoreActions().auth.signIn({ account, password });
          }
        } catch (err) {
          actions.set((state) => {
            state.recoveryState.recoverySubmit.error = err.message;
          });
        } finally {
          actions.set((state) => {
            state.recoveryState.recoverySubmit.loading = false;
          });
        }
      },
    ),
    recoveryReset: action((state) => {
      state.recoveryState = getDefaultRecoveryState();
    }),
  },
  {
    allow: ["cognitoUser", "user", "isMobile", "resendConfirmCodeTimestamp"],
    storage,
  },
);
export default auth;
