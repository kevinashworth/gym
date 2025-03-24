import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Location from "expo-location";

const defaultLocation = {
  coords: {
    latitude: process.env.EXPO_PUBLIC_MOCK_LOCATION_LAT || 37.10716,
    longitude: process.env.EXPO_PUBLIC_MOCK_LOCATION_LNG || -113.56079,
  },
} as Location.LocationObject;

interface LocationContextType {
  location: Location.LocationObject;
  lat: number;
  lng: number;
  setLocation: React.Dispatch<React.SetStateAction<Location.LocationObject>>;
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
  const [location, setLocation] =
    useState<Location.LocationObject>(defaultLocation);

  const lat = location.coords.latitude;
  const lng = location.coords.longitude;

  useEffect(() => {
    const getLocation = async () => {
      const loc = await Location.getCurrentPositionAsync({});
      if (loc) {
        setLocation(loc);
      }
    };
    getLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        lat,
        lng,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
