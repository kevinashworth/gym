import { PropsWithChildren } from "react";

import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the "X" icon
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

import BottomGet from "@/assets/svg/bottom-get";
import { spectrum } from "@/theme";

const window = Dimensions.get("window");
const screenWidthMinusPadding = window.width - 32;
const iconSize = 72;

interface DialogProps {
  isVisible: boolean;
  onHide: () => void;
}

const Dialog = ({ children, isVisible, onHide }: PropsWithChildren<DialogProps>) => {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onDismiss={onHide}>
      <View style={styles.background}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onHide}>
            <Ionicons name="close" size={18} color={spectrum.base1Content} />
          </TouchableOpacity>
          <View style={styles.topIconContainer}>
            <View style={styles.topIcon}>
              <BottomGet size={iconSize} />
            </View>
          </View>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const shadow = {
  shadowColor: spectrum.base1Content,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 5,
  elevation: 4,
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: spectrum.white,
    borderRadius: 12,
    padding: 8,
    width: screenWidthMinusPadding,
    ...shadow,
  },
  closeButton: {
    backgroundColor: spectrum.gray5,
    borderRadius: 12,
    padding: 2,
    position: "absolute",
    right: 12,
    top: 12,
    zIndex: 3,
  },
  topIconContainer: {
    alignItems: "center",
    height: 26,
    position: "relative",
  },
  topIcon: {
    alignItems: "center",
    backgroundColor: spectrum.white,
    borderRadius: iconSize / 2,
    height: iconSize,
    position: "absolute",
    top: -46,
    width: iconSize,
    zIndex: 2,
  },
  content: {
    alignItems: "center",
    // backgroundColor: spectrum.error,
    margin: 8,
    padding: 8,
  },
});

export default Dialog;
