import { StyleSheet } from "react-native";
import { BaseToast } from "react-native-toast-message";

import { spectrum } from "@/theme";

function MyToast(props: any) {
  return (
    <BaseToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={styles.text1}
      text1NumberOfLines={2}
      text2Style={styles.text2}
    />
  );
}

export const toastConfig = {
  success: (props: any) => <MyToast {...props} style={{ borderLeftColor: spectrum.success }} />,
  info: (props: any) => <MyToast {...props} style={{ borderLeftColor: spectrum.primaryLight }} />,
  primary: (props: any) => <MyToast {...props} style={{ borderLeftColor: spectrum.primary }} />,
  secondary: (props: any) => <MyToast {...props} style={{ borderLeftColor: spectrum.secondary }} />,
  error: (props: any) => <MyToast {...props} style={{ borderLeftColor: spectrum.error }} />,
  // successToast: (props: any) => (
  //   <View
  //     style={{
  //       backgroundColor: spectrum.success,
  //       borderRadius: 8,
  //       justifyContent: "center",
  //       minWidth: 196,
  //       padding: 16,
  //     }}
  //   >
  //     <Text
  //       style={{
  //         color: spectrum.white,
  //         fontSize: 16,
  //         fontWeight: 500,
  //         textAlign: "center",
  //       }}
  //     >
  //       {props.text1}
  //     </Text>
  //   </View>
  // ),
};

const styles = StyleSheet.create({
  text1: {
    color: spectrum.black,
    fontSize: 15,
    fontWeight: 400,
  },
  text2: {
    color: spectrum.base1Content,
    fontSize: 13,
  },
});
