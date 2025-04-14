import { useRouter } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

import Button from "@/components/button";
import { useAuthStore } from "@/store";

export default function SignUpSuccess() {
  const router = useRouter();

  const account = useAuthStore((s) => s.account);
  const cognitoUser = useAuthStore((s) => s.cognitoUser);
  const setTempMessage = useAuthStore((s) => s.setTempMessage);
  const token = useAuthStore((s) => s.token);

  const directSignIn = () => {
    // We should have account, cognitoUser and token; verify and send to
    // dashboard. Any problems, send to sign in.
    if (cognitoUser === null || token === "") {
      setTempMessage("Please sign in again");
      router.replace("/entry/sign-in");
      return;
    }

    router.replace("/(tabs)/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitleText}>Sign Up is successful!</Text>
      <Text style={styles.text}>Your account is {account}</Text>
      <View style={styles.buttonContainer}>
        <Button label="Sign In Automatically" onPress={directSignIn} size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
    padding: 16,
  },
  pageTitleText: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: 32,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
});
