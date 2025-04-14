import { useContext, useEffect, createContext, type PropsWithChildren } from "react";

import { usePathname, useRouter } from "expo-router";

import { useAuthStore, useDevStore } from "@/store";

import type { CognitoUser } from "@/types/auth";

interface AuthContextType {
  cognitoUser: CognitoUser | null;
  token: string;
  isUserAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (value === null) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

// List of route prefixes that will not be protected
const unprotectedPaths = ["/"];
const unprotectedPrefixes = ["/entry"];

const unhandledPaths = ["/settings/dev"];

// This hook runs on every route change and will protect the route access based on user authentication.
function useProtectedRoute(isUserAuthenticated: boolean) {
  const showPathnameLog = useDevStore((s) => s.showPathnameLog);
  const pathname = usePathname();
  if (showPathnameLog) console.log("pathname:", pathname);
  const router = useRouter();

  useEffect(() => {
    const isUnprotectedPath =
      unprotectedPaths.some((path) => pathname === path) ||
      unprotectedPrefixes.some((path) => pathname.startsWith(path));
    const isUnhandledPath = unhandledPaths.some((path) => pathname === path);

    // If the path is unhandled, just log it. This is for debugging purposes.
    if (isUnhandledPath) {
      console.log("[useProtectedRoute] Unhandled path:", pathname);
    }
    // If the user is not signed in and the path is protected, redirect to welcome page.
    else if (!isUserAuthenticated && !isUnprotectedPath) {
      console.log("[useProtectedRoute] Redirecting to welcome");
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/");
    }
    // If the user is signed in and the path is unprotected, we still redirect to dashboard page. TODO: Just show the current page?
    else if (isUserAuthenticated && isUnprotectedPath) {
      console.log("[useProtectedRoute] Redirecting to dashboard");
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/(tabs)");
    }
    // Otherwise, do nothing.
    else {
      // console.log("[useProtectedRoute] Not redirecting");
    }
  }, [isUserAuthenticated, pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function SessionProvider({ children }: PropsWithChildren) {
  const cognitoUser = useAuthStore((s) => s.cognitoUser);
  const token = useAuthStore((s) => s.token);
  const isUserAuthenticated = !!cognitoUser?.attributes?.email && !!token;
  if (!isUserAuthenticated)
    console.log("[SessionProvider] isUserAuthenticated:", isUserAuthenticated);
  useProtectedRoute(isUserAuthenticated);

  return (
    <AuthContext.Provider value={{ cognitoUser, token, isUserAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
