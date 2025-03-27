import React from "react";

import { renderHook, act, waitFor } from "@testing-library/react-native";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";

import { LocationProvider, useLocation } from "./location";

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

describe("LocationContext", () => {
  const mockLocation = {
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
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "granted" });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(mockLocation);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LocationProvider>{children}</LocationProvider>
  );

  test("initializes with default location from environment variables", async () => {
    const { result } = renderHook(() => useLocation(), { wrapper });

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
    expect(Location.getForegroundPermissionsAsync).toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).toHaveBeenCalled();

    // Should now have the mock location
    expect(result.current.lat).toBe(mockLocation.coords.latitude);
    expect(result.current.lng).toBe(mockLocation.coords.longitude);
    expect(result.current.location).toEqual(mockLocation);
  });

  test("handles permission denied", async () => {
    // Mock permission denied
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "denied",
    });

    const { result } = renderHook(() => useLocation(), { wrapper });

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
    (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useLocation(), { wrapper });

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

  test("refreshLocation updates location when successful", async () => {
    const { result } = renderHook(() => useLocation(), { wrapper });

    // Wait for initial location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    // Update mock location for refresh
    const updatedLocation = {
      ...mockLocation,
      coords: {
        ...mockLocation.coords,
        latitude: 40.7128,
        longitude: -74.006,
      },
    };
    (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue(updatedLocation);

    // Call refreshLocation
    await act(async () => {
      await result.current.refreshLocation();
    });

    // Should have updated location
    expect(result.current.lat).toBe(updatedLocation.coords.latitude);
    expect(result.current.lng).toBe(updatedLocation.coords.longitude);
    expect(result.current.location).toEqual(updatedLocation);
  });

  test.skip("retryPermission requests permissions and updates location", async () => {
    // Initially denied permission
    (Location.getForegroundPermissionsAsync as jest.Mock).mockResolvedValue({ status: "denied" });

    const { result } = renderHook(() => useLocation(), { wrapper });

    // Wait for initial permission check to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    expect(result.current.hasPermission).toBe(false);

    // Now grant permission for retry
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
      status: "granted",
    });

    // Call retryPermission
    await act(async () => {
      await result.current.retryPermission();
    });

    // Should have updated permission status and location
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.lat).toBe(mockLocation.coords.latitude);
    expect(result.current.lng).toBe(mockLocation.coords.longitude);
  });

  test("setLocation updates the location state", async () => {
    const { result } = renderHook(() => useLocation(), { wrapper });

    // Wait for initial location request to complete
    await waitFor(() => {
      expect(result.current.isRequesting).toBe(false);
    });

    const customLocation = {
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
      result.current.setLocation(customLocation);
    });

    // Should have updated location
    expect(result.current.lat).toBe(customLocation.coords.latitude);
    expect(result.current.lng).toBe(customLocation.coords.longitude);
    expect(result.current.location).toEqual(customLocation);
  });

  test.skip("prevents concurrent location requests", async () => {
    const { result } = renderHook(() => useLocation(), { wrapper });

    // Set isRequesting to true manually
    act(() => {
      result.current.setLocation({
        ...result.current.location,
      });
    });

    // Reset mocks to track new calls
    jest.clearAllMocks();

    // Try to refresh location while already requesting
    act(() => {
      // Force isRequesting to true
      Object.defineProperty(result.current, "isRequesting", { value: true });
    });

    await act(async () => {
      await result.current.refreshLocation();
    });

    // Should not have called location APIs
    expect(Location.getForegroundPermissionsAsync).not.toHaveBeenCalled();
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });
});
