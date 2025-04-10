import React from "react";

import { renderHook, act, waitFor } from "@testing-library/react-native";
import * as GeoLocation from "expo-location"; // NB: We call it GeoLocation to avoid confusion with our own locations from our API
import Toast from "react-native-toast-message";

import { GeoLocationProvider, useGeoLocation } from "./location";

// Mock the expo-location module
jest.mock("expo-location", () => ({
  getCurrentPositionAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getForegroundPermissionsAsync: jest.fn(),
  Accuracy: {
    Balanced: 3,
  },
}));

// Mock react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  show: jest.fn(),
}));

// Mock environment variables
process.env.EXPO_PUBLIC_MOCK_LOCATION_LAT = "37.7749";
process.env.EXPO_PUBLIC_MOCK_LOCATION_LNG = "-122.4194";

describe("GeoLocationContext", () => {
  const mockGeoLocation = {
    coords: {
      latitude: 34.0522,
      longitude: -118.2437,
      altitude: 100,
      accuracy: 10,
      altitudeAccuracy: 10,
      heading: 0,
      speed: 0,
    },
    timestamp: 1616161616161,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (GeoLocation.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (GeoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (GeoLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockGeoLocation);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <GeoLocationProvider>{children}</GeoLocationProvider>
  );

  test("initializes with default location from environment variables", async () => {
    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Initial state should use the default location from env vars
    expect(result.current.lat).toBe(37.10716);
    expect(result.current.lng).toBe(-113.56079);
    expect(result.current.errorMsg).toBeNull();
    expect(result.current.isRequesting).toBe(true); // Initially true as it requests on mount

    // Wait for the initial location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    // After initialization, should have requested permissions and location
    expect(GeoLocation.getForegroundPermissionsAsync).toHaveBeenCalled();
    expect(GeoLocation.getCurrentPositionAsync).toHaveBeenCalled();

    // Should now have the mock location
    expect(result.current.lat).toBe(mockGeoLocation.coords.latitude);
    expect(result.current.lng).toBe(mockGeoLocation.coords.longitude);
    expect(result.current.geoLocation).toEqual(mockGeoLocation);
  });

  test("handles permission denied", async () => {
    // Mock permission denied
    (GeoLocation.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });
    (GeoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for the permission request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    expect(result.current.hasPermission).toBe(false);
    expect(result.current.errorMsg).toBe("Location permission is required to find stores near you");
  });

  test("handles location error", async () => {
    // Mock location error
    const mockError = new Error("Location unavailable");
    (GeoLocation.getCurrentPositionAsync as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for the location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    expect(result.current.errorMsg).toBe("Location unavailable");
    expect(Toast.show).toHaveBeenCalledWith({
      type: "error",
      text1: "Location Error",
      text2: "Location unavailable",
    });
  });

  test("refreshGeoLocation updates location when successful", async () => {
    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for initial location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    // Update mock location for refresh
    const updatedGeoLocation = {
      ...mockGeoLocation,
      coords: {
        ...mockGeoLocation.coords,
        latitude: 40.7128,
        longitude: -74.006,
      },
    };
    (GeoLocation.getCurrentPositionAsync as jest.Mock).mockResolvedValue(updatedGeoLocation);

    // Call refreshGeoLocation
    await act(async () => {
      await result.current.refreshGeoLocation();
    });

    // Should have updated location
    expect(result.current.lat).toBe(updatedGeoLocation.coords.latitude);
    expect(result.current.lng).toBe(updatedGeoLocation.coords.longitude);
    expect(result.current.geoLocation).toEqual(updatedGeoLocation);
  });

  test.skip("retryGeoLocationPermission requests permissions and updates location", async () => {
    // Initially denied permission
    (GeoLocation.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for initial permission check to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    expect(result.current.hasPermission).toBe(false);

    // Now grant permission for retry
    (GeoLocation.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    // Call retryGeoLocationPermission
    await act(async () => {
      await result.current.retryGeoLocationPermission();
    });

    // Should have updated permission status and location
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.lat).toBe(mockGeoLocation.coords.latitude);
    expect(result.current.lng).toBe(mockGeoLocation.coords.longitude);
  });

  test("setLocation updates the location state", async () => {
    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Wait for initial location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    const customGeoLocation = {
      coords: {
        latitude: 51.5074,
        longitude: -0.1278,
        altitude: null,
        accuracy: 10,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    // Update location using setLocation
    act(() => {
      result.current.setLocation(customGeoLocation);
    });

    // Should have updated location
    expect(result.current.lat).toBe(customGeoLocation.coords.latitude);
    expect(result.current.lng).toBe(customGeoLocation.coords.longitude);
    expect(result.current.geoLocation).toEqual(customGeoLocation);
  });

  test.skip("prevents concurrent location requests", async () => {
    const { result } = renderHook(() => useGeoLocation(), { wrapper });

    // Set isRequesting to true manually
    act(() => {
      result.current.setGeoLocation(result.current.geoLocation);
    });

    // Reset mocks to track new calls
    jest.clearAllMocks();

    // Try to refresh location while already requesting
    act(() => {
      // Force isRequesting to true
      Object.defineProperty(result.current, "isRequesting", { value: true });
    });

    await act(async () => {
      await result.current.refreshGeoLocation();
    });

    // Should not have called location APIs
    expect(GeoLocation.getForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(GeoLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
