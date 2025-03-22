import {
  useContext,
  useEffect,
  createContext,
  type PropsWithChildren,
} from "react";

import { usePathname, useRouter } from "expo-router";

import { useAuthStore } from "@/store";

import type { CognitoUser } from "@/types/auth";

interface AuthContextType {
  cognitoUser: CognitoUser | null;
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
const unprotectedPrefixes = ["/welcome", "/entry"];

// This hook runs on every route change and will protect the route access based on user authentication.
function useProtectedRoute(user: CognitoUser | null) {
  const pathname = usePathname();
  console.log("[useProtectedRoute] pathname:", pathname);
  const router = useRouter();

  useEffect(() => {
    const isUnprotected = unprotectedPrefixes.some((path) =>
      pathname.startsWith(path),
    );

    // If the user is not signed in and the path is protected, redirect to welcome page.
    if (!user && !isUnprotected) {
      console.log("[useProtectedRoute] Redirecting to welcome");
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/welcome");
    }
    // If the user is signed in and the path is unprotected, we still redirect to dashboard page. TODO: Just show the current page?
    else if (user && isUnprotected) {
      console.log("[useProtectedRoute] Redirecting to dashboard");
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/(tabs)");
    }
    // Otherwise, do nothing.
    else {
      console.log("[useProtectedRoute] Not redirecting");
    }
  }, [user, pathname]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function SessionProvider({ children }: PropsWithChildren) {
  const cognitoUser = useAuthStore((s) => s.cognitoUser);
  useProtectedRoute(cognitoUser);

  return (
    <AuthContext.Provider value={{ cognitoUser }}>
      {children}
    </AuthContext.Provider>
  );
}
