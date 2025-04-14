// We call it GeoLocation to avoid confusion with our own locations from our
// API, and to avoid naming conflicts with `location` on the window object.

// There is a useFocusEffect in src/app/(tabs)/dashboard.tsx that is the first
// code to use this context when our app is first loaded.

import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import * as GeoLocation from "expo-location";
import Toast from "react-native-toast-message";

interface GeoLocationContextType {
  errorMsg: string | null;
  hasPermission: boolean;
  isRequesting: boolean;
  lat: number | undefined;
  lng: number | undefined;
  geoLocation: GeoLocation.LocationObject | null;
  refreshGeoLocation: () => Promise<void>;
  retryGeoLocationPermission: () => Promise<void>;
  setGeoLocation: React.Dispatch<React.SetStateAction<GeoLocation.LocationObject | null>>;
  setLocation: React.Dispatch<React.SetStateAction<GeoLocation.LocationObject | null>>;
}

const GeoLocationContext = createContext<GeoLocationContextType | null>(null);

// This hook can be used to access the location info.
export function useGeoLocation() {
  const value = useContext(GeoLocationContext);
  if (value === null) {
    throw new Error("useGeoLocation must be wrapped in a <GeoLocationProvider />");
  }

  return value;
}

const GeoLocationProvider = ({ children }: PropsWithChildren) => {
  const [geoLocation, setGeoLocation] = useState<GeoLocation.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false); // initial value of true helps us not rely on lat/lng too soon
  const [hasPermission, setHasPermission] = useState(false);

  const lat = geoLocation?.coords.latitude;
  const lng = geoLocation?.coords.longitude;

  // run once on mount
  useEffect(() => {
    requestGeoLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // run on mount
  // useEffect(() => {
  //   refreshGeoLocation();
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // see https://stackoverflow.com/a/76037136/7082724
  function getCurrentGeoLocation() {
    const timeout = 10000;
    return new Promise<GeoLocation.LocationObject | null>(async (resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Error getting gps location after ${(timeout * 2) / 1000} s`));
      }, timeout * 2);
      setTimeout(async () => {
        resolve(await GeoLocation.getLastKnownPositionAsync());
      }, timeout);
      resolve(
        await GeoLocation.getCurrentPositionAsync({
          accuracy: GeoLocation.Accuracy.Balanced,
        })
      );
    });
  }

  async function requestGeoLocation() {
    setIsRequesting(true);
    const permissionGranted = await checkGeoLocationPermission();
    if (!permissionGranted) {
      setIsRequesting(false);
      return;
    }

    try {
      let location = await getCurrentGeoLocation();
      setGeoLocation(location);
      setErrorMsg(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get location";
      setErrorMsg(errorMessage);
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2: errorMessage,
      });
    } finally {
      setIsRequesting(false);
    }
  }

  async function checkGeoLocationPermission(): Promise<boolean> {
    try {
      const { status } = await GeoLocation.requestForegroundPermissionsAsync();
      const permissionGranted = status === "granted";
      setHasPermission(permissionGranted);

      if (!permissionGranted) {
        const errorMessage = "Location permission is required to find stores near you";
        setErrorMsg(errorMessage);
        Toast.show({
          type: "error",
          text1: "Permission Error",
          text2: errorMessage,
        });
      } else {
        setErrorMsg(null);
      }
      return permissionGranted;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request location permission";
      setErrorMsg(errorMessage);
      Toast.show({
        type: "error",
        text1: "Permission Error",
        text2: errorMessage,
      });
      return false;
    }
  }
  async function retryGeoLocationPermission() {
    setIsRequesting(true);
    try {
      const permissionGranted = await checkGeoLocationPermission();
      if (permissionGranted) {
        await requestGeoLocation();
      }
    } finally {
      setIsRequesting(false);
    }
  }

  async function refreshGeoLocation() {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      const permissionGranted = await checkGeoLocationPermission();
      if (!permissionGranted) return;

      await requestGeoLocation();
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <GeoLocationContext.Provider
      value={{
        errorMsg,
        hasPermission,
        isRequesting,
        lat,
        lng,
        geoLocation,
        refreshGeoLocation,
        retryGeoLocationPermission,
        setGeoLocation,
        setLocation: setGeoLocation,
      }}>
      {children}
    </GeoLocationContext.Provider>
  );
};

export { GeoLocationContext, GeoLocationProvider };
