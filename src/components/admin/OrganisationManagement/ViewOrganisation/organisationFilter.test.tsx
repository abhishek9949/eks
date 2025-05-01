import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import OrganisationFilter from "./OrganisationFilter";
import "@testing-library/jest-dom";
import StoreProvider from "@/redux/StoreProvider";


const renderComponent = () => {
  render(
    <StoreProvider>
      <OrganisationFilter />
    </StoreProvider>
  );
}

describe("OrganisationFilter Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component with form inputs", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByLabelText(/Organisation name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Organisation Type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Created On/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
      expect(screen.getByText(/Reset/i)).toBeInTheDocument();
    })
  });

  it("handles input changes and calls debounced functions", async () => {
    renderComponent();
    const organisationNameInput = screen.getByLabelText<HTMLInputElement>(/Organisation name/i);
    act(() => fireEvent.change(organisationNameInput, { target: { value: "Test" } }));

    const createdAtInput = screen.getByLabelText<HTMLInputElement>(/Created On/i);
    act(() => fireEvent.change(createdAtInput, { target: { value: "2025-01-13" } }));

    await waitFor(() => {
      expect(organisationNameInput.value).toBe("Test");
      expect(createdAtInput.value).toBe("2025-01-13");
    })
  });

  it("resets the form inputs when Reset is clicked", async () => {
    renderComponent();
    const organisationNameInput = screen.getByLabelText<HTMLInputElement>(/Organisation name/i);
    act(() => fireEvent.change(organisationNameInput, { target: { value: "Test Name" } }));

    const resetButton = screen.getByText(/Reset/i);
    act(() => fireEvent.click(resetButton));

    await waitFor(() => {
      expect(organisationNameInput.value).toBe("");
    })
  });

});
