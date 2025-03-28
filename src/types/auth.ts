export type CognitoUser = {
  attributes: {
    email: string; // our `account` value should be the same as this `email`
    email_verified: boolean;
    sub: string; // unique identifier
  };
  authenticationFlowType: string;
  signInUserSession: {
    accessToken: {
      jwtToken: string;
    };
    idToken: {
      jwtToken: string;
    };
  };
  userDataKey: string;
  username: string; // same as email when signing up with email
};

export type GoogleUser = {
  email: string;
  id: string;
  name: string;
  token: string;
};

export function isCognitoUser(user: CognitoUser | GoogleUser): user is CognitoUser {
  return (user as CognitoUser).username !== undefined;
}

export function isGoogleUser(user: CognitoUser | GoogleUser): user is GoogleUser {
  return (user as GoogleUser).id !== undefined;
}

export function isUser(user: CognitoUser | GoogleUser): user is CognitoUser | GoogleUser {
  return isCognitoUser(user) || isGoogleUser(user);
}
