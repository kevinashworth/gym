import { render, fireEvent, screen } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

import WelcomeScreen from "@/app";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("@/assets/svg/logo-light", () => "LogoLight");
jest.mock("@/assets/svg/welcome", () => "Welcome");

jest.mock("expo-application", () => ({
  nativeApplicationVersion: "1.0.0",
}));

jest.mock("expo-linking", () => ({
  openURL: jest.fn(),
}));

describe("WelcomeScreen", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders correctly", () => {
    render(<WelcomeScreen />);

    // Check if main buttons are rendered
    expect(screen.getByText("Sign In")).toBeTruthy();
    expect(screen.getByText("Get Started")).toBeTruthy();

    // Check if footer text is rendered
    expect(screen.getByText("©2025 GotYou, Inc. All rights reserved.")).toBeTruthy();
    expect(screen.getByText(/Version/)).toBeTruthy();
  });

  it("navigates to sign in screen when Sign In button is pressed", () => {
    render(<WelcomeScreen />);

    fireEvent.press(screen.getByText("Sign In"));

    expect(mockPush).toHaveBeenCalledWith("/entry/sign-in");
  });

  it("navigates to sign up screen when Get Started button is pressed", () => {
    render(<WelcomeScreen />);

    fireEvent.press(screen.getByText("Get Started"));

    expect(mockPush).toHaveBeenCalledWith("/entry/sign-up/collect-account");
  });

  it("opens Terms and Conditions link when pressed", () => {
    render(<WelcomeScreen />);

    fireEvent.press(screen.getByText("Terms and Conditions"));

    expect(Linking.openURL).toHaveBeenCalledWith("https://www.gotyou.co/terms-and-conditions");
  });

  it("opens Privacy Policy link when pressed", () => {
    render(<WelcomeScreen />);

    fireEvent.press(screen.getByText("Privacy Policy"));

    expect(Linking.openURL).toHaveBeenCalledWith("https://www.gotyou.co/privacy-policy");
  });
});
