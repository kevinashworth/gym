import React from "react";

import { render } from "@testing-library/react-native";

import Empty from "../empty";

describe("Empty Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default and custom text", () => {
    // Test with default props
    const { getByText, rerender } = render(<Empty />);
    expect(getByText("No Data")).toBeTruthy();

    // Test with custom text
    rerender(<Empty text="Custom Empty Message" />);
    expect(getByText("Custom Empty Message")).toBeTruthy();
  });

  test("applies style prop correctly", () => {
    const { getByText } = render(<Empty style={{ backgroundColor: "red" }} />);
    const textElement = getByText("No Data");
    expect(textElement.props.style.backgroundColor).toBe("red");
  });
});
