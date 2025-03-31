import { useEffect, useRef, useState } from "react";

import { useIsFocused } from "@react-navigation/native";
import { BarcodeScanningResult, Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { router, Stack } from "expo-router";
import {
  AppState,
  Button as RNButton,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "@/components/button";
import DisplayJSON from "@/components/display-json";
import Icon from "@/components/icon";
import { useDevStore } from "@/store";
import { spectrum } from "@/theme";
import { uriValidator } from "@/utils/qrcode-scan";

import type { UriValidatorError, UriValidatorResult } from "@/utils/qrcode-scan";

const window = Dimensions.get("window");
const screenWidthForCamera = window.width * 0.75;

const borderRadius = 12;

export default function ActionTab() {
  const [permission, requestPermission] = useCameraPermissions();
  const showDevToolbox = useDevStore((s) => s.showDevToolbox);
  const isFocused = useIsFocused();
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<UriValidatorError>();
  const [scanResult, setScanResult] = useState<UriValidatorResult>();

  function handleBarcodeScanned({ data }: BarcodeScanningResult) {
    if (data && !qrLock.current) {
      qrLock.current = true;
      const url = Linking.parse(data);
      const { result, error } = uriValidator(url);
      if (error) {
        setScanError(error);
        setScanResult(undefined);
      }
      if (result) {
        setTimeout(() => {
          setScanResult(result);
          setScanError(undefined);
          const pathname = "/location/[uuid]";
          const params = Object.assign(
            { uuid: result.locationId },
            result.type === "referral" ? { referralCode: result.referralCode } : {},
            result.type === "checkin" ? { campaign_short_code: result.campaign_short_code } : {}
          );
          router.push({ pathname, params }); // TODO: `push` now seems ok with `isFocused`, but if not, `replace` could be better, as `push` keeps this screen on the Stack
        }, 500);
      }
    }
  }

  async function handlePickImage() {
    let pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      quality: 1,
    });

    if (!pick.canceled) {
      const pickedImage = pick.assets[0].uri;
      setPickedImage(pickedImage);
      const scan = await Camera.scanFromURLAsync(pickedImage);
      const url = Linking.parse(scan[0].data);
      const { result, error } = uriValidator(url);
      if (error) {
        setScanError(error);
        setScanResult(undefined);
      }
      if (result) {
        setScanError(undefined);
        setScanResult(result);
        setTimeout(() => {
          const pathname = "/location/[uuid]";
          const params = Object.assign(
            { uuid: result.locationId },
            result.type === "referral" ? { referralCode: result.referralCode } : {},
            result.type === "checkin" ? { campaign_short_code: result.campaign_short_code } : {}
          );
          router.push({ pathname, params });
        }, 500);
      }
    }
  }
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  function resetState() {
    setPickedImage(null);
    qrLock.current = false;
    setScanError(undefined);
    setScanResult(undefined);
  }

  // unmount code
  useEffect(() => {
    return () => {
      resetState();
    };
  });

  // Camera permissions are still loading.
  if (!permission) {
    return <View />;
  }

  // Camera permissions are not granted yet.
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Enable camera permissions for the GotYou&nbsp;app, so you can start scanning QR&nbsp;codes
        </Text>
        <RNButton onPress={requestPermission} title="Grant permission" color={spectrum.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.h6}>Position the QR code in the camera box below</Text>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={isFocused ? handleBarcodeScanned : undefined}
            style={[styles.camera, Platform.OS === "ios" ? styles.cameraIOS : styles.cameraAndroid]}
          />
          <View style={styles.overlayIconContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <View style={styles.overlayIcon}>
                <Icon name="image" color="white" size={36} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {showDevToolbox && (
          <View style={styles.toolbox}>
            <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
            <DisplayJSON json={{ pickedImage, qrLock, scanError, scanResult }} />
            <Button iconName="refresh" onPress={resetState} label="Reset local state" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  h6: {
    fontSize: 16,
    fontWeight: 300,
    paddingVertical: 16,
    textAlign: "center",
    width: 196,
  },
  linearGradient: {
    borderRadius,
    padding: 4,
  },
  message: {
    fontSize: 15,
    padding: 12,
    textAlign: "center",
  },
  camera: {
    borderRadius,
    flex: 1,
  },
  cameraIOS: {
    width: "100%",
  },
  cameraAndroid: {
    width: "180%",
  },
  cameraContainer: {
    alignItems: "center",
    backgroundColor: "black",
    borderRadius,
    height: screenWidthForCamera,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    width: screenWidthForCamera,
  },
  overlayIconContainer: {
    aspectRatio: 1,
    justifyContent: "flex-end",
    position: "absolute",
    width: "100%",
  },
  overlayIcon: {
    alignSelf: "flex-end",
    backgroundColor: spectrum.base2Content,
    borderRadius: 8,
    marginBottom: 8,
    marginRight: 8,
  },
  toolbox: {
    backgroundColor: spectrum.gray1,
    borderColor: spectrum.gray8,
    borderWidth: 2,
    borderRadius: 8,
    gap: 8,
    margin: 8,
    padding: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
});
