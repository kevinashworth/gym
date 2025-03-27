import React from "react";

import { render, fireEvent } from "@testing-library/react-native";

import Button, { Variants } from "../button";

describe("Button", () => {
  it("renders with the correct label", () => {
    const { getByText } = render(<Button label="Test Button" onPress={() => {}} />);
    expect(getByText("Test Button")).toBeTruthy();
  });

  it("calls onPress when clicked", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button label="Test Button" onPress={onPress} />);
    fireEvent.press(getByText("Test Button"));
    expect(onPress).toHaveBeenCalled();
  });

  it("renders in a disabled state", async () => {
    const { findByText } = render(<Button label="Test Button" onPress={() => {}} disabled />);
    const button = await findByText("Test Button");
    expect(button).toBeDisabled();
  });

  it("renders with an activity indicator", () => {
    const { getByTestId } = render(
      <Button label="Test Button" onPress={() => {}} activityIndicator />
    );
    expect(getByTestId("activity-indicator")).toBeTruthy();
  });

  it("renders with different variants", () => {
    const variants = ["primary", "secondary", "outline", "error", "black", "white", "default"];

    variants.forEach((variant) => {
      const { getByText } = render(
        <Button label={`${variant} Button`} onPress={() => {}} variant={variant as Variants} />
      );
      expect(getByText(`${variant} Button`)).toBeTruthy();
    });
  });
});
