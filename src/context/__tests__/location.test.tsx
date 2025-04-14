import React from "react";

import { renderHook, act } from "@testing-library/react-native";
import * as ExpoLocation from "expo-location";
import Toast from "react-native-toast-message";

import { GeoLocationProvider, useGeoLocation } from "@/context/location";

jest.mock("expo-location");
jest.mock("react-native-toast-message");

jest.useFakeTimers();

describe("GeoLocation Context", () => {
  // Mock location data
  const mockLocation = {
    coords: {
      latitude: 40.7128,
      longitude: -74.006,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 1234567890,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations
    (ExpoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (ExpoLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);
    (ExpoLocation.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(mockLocation);
  });

  it("should provide location context when permission is granted", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GeoLocationProvider>{children}</GeoLocationProvider>
    );

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for the initial location request to complete
    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current.hasPermission).toBe(true);
    expect(result.current.errorMsg).toBeNull();
    expect(result.current.lat).toBe(mockLocation.coords.latitude);
    expect(result.current.lng).toBe(mockLocation.coords.longitude);
    expect(result.current.isRequesting).toBe(false);
  });

  it("should handle permission denied", async () => {
    // Mock permission denied
    (ExpoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GeoLocationProvider>{children}</GeoLocationProvider>
    );

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.errorMsg).toBe("Location permission is required to find stores near you");
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "Permission Error",
      })
    );
  });

  it.skip("should handle location error", async () => {
    // Mock location error
    (ExpoLocation.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
      new Error("Location service error")
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GeoLocationProvider>{children}</GeoLocationProvider>
    );

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    await act(async () => {
      jest.runAllTimers();
    });

    expect(result.current.errorMsg).toBe("Location service error");
    expect(Toast.show).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text1: "Location Error",
      })
    );
  });

  it("should refresh location successfully", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GeoLocationProvider>{children}</GeoLocationProvider>
    );

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    await act(async () => {
      jest.runAllTimers();
    });

    // Refresh location
    await act(async () => {
      await result.current.refreshGeoLocation();
      jest.runAllTimers();
    });

    expect(result.current.lat).toBe(mockLocation.coords.latitude);
    expect(result.current.lng).toBe(mockLocation.coords.longitude);
    expect(result.current.isRequesting).toBe(false);
  });

  it("should throw error when useGeoLocation is used outside provider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {}); // https://github.com/facebook/react/issues/11098#issuecomment-653208411

    expect(() => {
      renderHook(() => useGeoLocation());
    }).toThrow("useGeoLocation must be wrapped in a <GeoLocationProvider />");

    consoleSpy.mockRestore();
  });
});
