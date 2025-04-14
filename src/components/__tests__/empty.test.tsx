import React from "react";

import { render, screen } from "@testing-library/react-native";

import Empty from "../empty";

describe("Empty Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default and custom text", () => {
    // Test with default props
    render(<Empty />);
    expect(screen.getByText("No Data")).toBeTruthy();

    // Test with custom text
    render(<Empty text="Custom Empty Message" />);
    expect(screen.getByText("Custom Empty Message")).toBeTruthy();
  });

  test("applies style prop correctly", () => {
    render(<Empty style={{ backgroundColor: "red" }} />);
    expect(screen.getByTestId("the-empty-component")).toHaveStyle({ backgroundColor: "red" });
  });

  test("applies textStyle prop correctly", () => {
    render(<Empty textStyle={{ fontSize: 32 }} text="Custom Empty Message" />);
    expect(screen.getByText("Custom Empty Message")).toHaveStyle({ fontSize: 32 });
  });
});
