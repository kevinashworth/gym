import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import * as Location from "expo-location";
import Toast from "react-native-toast-message";

import { useDevStore } from "@/store";

const mockLocation = {
  coords: {
    latitude: Number(process.env.EXPO_PUBLIC_MOCK_LOCATION_LAT),
    longitude: Number(process.env.EXPO_PUBLIC_MOCK_LOCATION_LNG),
  },
} as Location.LocationObject;

interface LocationContextType {
  errorMsg: string | null;
  hasPermission: boolean;
  isRequesting: boolean;
  lat: number | undefined;
  lng: number | undefined;
  location: Location.LocationObject | null;
  refreshLocation: () => Promise<void>;
  retryPermission: () => Promise<void>;
  setLocation: React.Dispatch<React.SetStateAction<Location.LocationObject | null>>;
}

const LocationContext = createContext<LocationContextType | null>(null);

// This hook can be used to access the location info.
export function useLocation() {
  const value = useContext(LocationContext);
  if (value === null) {
    throw new Error("useLocation must be wrapped in a <LocationProvider />");
  }

  return value;
}

const LocationProvider = ({ children }: PropsWithChildren) => {
  const { enableMockLocation } = useDevStore();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const lat = location?.coords.latitude;
  const lng = location?.coords.longitude;

  useEffect(() => {
    if (enableMockLocation && !location) {
      setLocation(mockLocation);
    }
  }, [enableMockLocation, location]);

  const requestLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(location);
      setErrorMsg(null);
      return location;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to get location";
      setErrorMsg(errorMessage);
      Toast.show({
        type: "error",
        text1: "Location Error",
        text2: errorMessage,
      });
      return null;
    }
  };

  const retryPermission = async () => {
    setIsRequesting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
      if (status === "granted") {
        await requestLocation();
      } else {
        setErrorMsg("Location permission is required to find stores near you");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to request location permission";
      setErrorMsg(errorMessage);
      Toast.show({
        type: "error",
        text1: "Permission Error",
        text2: errorMessage,
      });
    } finally {
      setIsRequesting(false);
    }
  };

  async function refreshLocation() {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") {
        await retryPermission();
        return;
      }

      await requestLocation();
    } finally {
      setIsRequesting(false);
    }
  }

  useEffect(() => {
    refreshLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LocationContext.Provider
      value={{
        errorMsg,
        hasPermission,
        isRequesting,
        lat,
        lng,
        location,
        refreshLocation,
        retryPermission,
        setLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
