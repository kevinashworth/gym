import { useEffect, useRef, useState } from "react";

import {
  BarcodeScanningResult,
  Camera,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
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

import type {
  UriValidatorError,
  UriValidatorResult,
} from "@/utils/qrcode-scan";

const window = Dimensions.get("window");
const screenWidthForCamera = window.width * 0.75;

const borderRadius = 12;

export default function ActionTab() {
  const enableDevToolbox = useDevStore((s) => s.enableDevToolbox);

  const [permission, requestPermission] = useCameraPermissions();

  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);

  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [scanError, setScanError] = useState<UriValidatorError>();
  const [scanResult, setScanResult] = useState<UriValidatorResult>();

  function handleBarcodeScannedFn({ data }: BarcodeScanningResult) {
    if (data && !qrLock.current) {
      qrLock.current = true;
      const url = Linking.parse(data);
      const { result, error } = uriValidator(url);
      console.log("handleBarCodeScanned", { url, result, error });
      if (error) {
        setScanError(error);
        setScanResult(undefined);
        // return;
      }
      if (result) {
        setTimeout(() => {
          setScanResult(result);
          setScanError(undefined);
          const pathname = "/location/[uuid]";
          const params = Object.assign(
            { uuid: result.locationId },
            result.type === "referral"
              ? { referralCode: result.referralCode }
              : {},
            result.type === "checkin"
              ? { campaign_short_code: result.campaign_short_code }
              : {},
          );
          // TODO: push would be better, but keeps this screen on the navigation Stack. hmmm.
          router.replace({
            pathname,
            params,
          });
        }, 500);
      }
    }
  }
  // We need this because the scanning happens again and again
  // const handleBarcodeScanned = useCallback(handleBarcodeScannedFn, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
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

  useEffect(() => {
    return () => {
      // put unmount code here
      resetState();
    };
  });

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
      console.log("handlePickImage", { url, result, error });
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
            result.type === "referral"
              ? { referralCode: result.referralCode }
              : {},
            result.type === "checkin"
              ? { campaign_short_code: result.campaign_short_code }
              : {},
          );
          router.push({
            pathname,
            params,
          });
        }, 500);
      }
    }
  }

  // async function pickImageAsync() {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: "images",
  //     allowsEditing: true,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setPickedImage(result.assets[0].uri);
  //   }
  // }

  // useEffect(() => {
  //   async function handlePickedImage() {
  //     console.log("pickedImage:", pickedImage);
  //     if (pickedImage) {
  //       const scanResult = await Camera.scanFromURLAsync(pickedImage);
  //       const url = Linking.parse(scanResult[0].data);
  //       // const url = scanResult[0].data;
  //       const { result, error } = uriValidator(url);
  //       console.log("handleBarCodeScanned", { url, result, error });
  //       if (error) {
  //         setScanError(error);
  //         setScanResult(undefined);
  //       }
  //       if (result) {
  //         setTimeout(() => {
  //           const pathname = "/location/[uuid]";
  //           const params = Object.assign(
  //             { uuid: result.locationId },
  //             result.type === "referral"
  //               ? { referralCode: result.referralCode }
  //               : {},
  //             result.type === "checkin"
  //               ? { campaign_short_code: result.campaign_short_code }
  //               : {},
  //           );
  //           // TODO: push would be better, but keeps this screen on the navigation Stack. hmmm.
  //           router.replace({
  //             pathname,
  //             params,
  //           });
  //         }, 500);
  //       }
  //     }
  //   }
  //   handlePickedImage();
  // }, [pickedImage]);

  // Camera permissions are still loading.
  if (!permission) {
    return <View />;
  }
  // Camera permissions are not granted yet.
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        q
        <Text style={styles.message}>
          Enable camera permissions for the GotYou&nbsp;app, so you can start
          scanning QR&nbsp;codes
        </Text>
        <RNButton onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.h6}>
            Position the QR code in the camera box below
          </Text>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={handleBarcodeScannedFn}
            // TODO: Remove this once expo-camera v16.0.18 is released
            // onCameraReady={() => setCameraReady(true)}
            // onBarcodeScanned={isCameraReady ? handleBarcodeScanned : undefined}
            // onBarcodeScanned={hasScanned ? undefined : handleBarcodeScannedFn}
            style={[
              styles.camera,
              Platform.OS === "ios" ? styles.cameraIOS : styles.cameraAndroid,
            ]}
          />
          <View style={styles.overlayIconContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <View style={styles.overlayIcon}>
                <Icon name="image" color="white" size={36} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {enableDevToolbox && (
          <View style={styles.toolbox}>
            <Text style={styles.toolboxHeader}>Dev Toolbox</Text>
            <RNButton title="RN" />
            <Button
              iconName="refresh"
              onPress={resetState}
              label="Reset local state"
            />
            <DisplayJSON
              json={{ pickedImage, qrLock, scanError, scanResult }}
            />
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
    fontSize: 18,
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
    marginVertical: 8,
    padding: 8,
  },
  toolboxButton: {
    borderColor: spectrum.gray8,
    borderWidth: 2,
    borderRadius: 8,
  },
  toolboxHeader: {
    color: spectrum.primaryLight,
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
  },
});
