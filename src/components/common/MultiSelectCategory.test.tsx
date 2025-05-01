import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("MultiSelectDropdown Component", () => {
  const options = [
    { id: 1, label: "Option 1" },
    { id: 2, label: "Option 2" },
    { id: 3, label: "Option 3" },
  ];


  it("displays placeholder text", () => {
    renderWithTheme(
      <MultiSelectDropdown id="test-dropdown" value={[]} options={options} onChange={() => {}} placeholder="Select options" />
    );
    expect(screen.getByPlaceholderText("Select options")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    renderWithTheme(<MultiSelectDropdown id="test-dropdown" value={[]} options={options} onChange={() => {}} />);
    const input = screen.getByRole("combobox");
    fireEvent.mouseDown(input);
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("allows selecting multiple options", () => {
    const handleChange = jest.fn();
    renderWithTheme(
      <MultiSelectDropdown id="test-dropdown" value={[]} options={options} onChange={handleChange} />
    );

    fireEvent.mouseDown(screen.getByRole("combobox"));
    fireEvent.click(screen.getByText("Option 1"));
    fireEvent.click(screen.getByText("Option 2"));

    expect(handleChange).toHaveBeenNthCalledWith(1, [{ id: 1, label: "Option 1" }]);
    expect(handleChange).toHaveBeenNthCalledWith(2, [{ id: 2, label: "Option 2" }]);
    
  });

  it("disables dropdown when disabled prop is true", () => {
    renderWithTheme(
      <MultiSelectDropdown id="test-dropdown" value={[]} options={options} onChange={() => {}} disabled />
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
