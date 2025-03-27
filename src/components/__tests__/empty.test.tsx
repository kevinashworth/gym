import React from "react";

import { render } from "@testing-library/react-native";

// Import the component under test
import Empty from "../empty";

describe("Empty Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with default and custom text", () => {
    // Test with default props
    const { getByText, rerender } = render(<Empty />);

    // Check default text content
    expect(getByText("No Data")).toBeTruthy();

    // Test with custom text
    rerender(<Empty text="Custom Empty Message" />);

    // Check custom text content
    expect(getByText("Custom Empty Message")).toBeTruthy();
  });
});
