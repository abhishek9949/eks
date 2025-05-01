import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import SubscriptionFilter from "./SubscriptionFilter";
import "@testing-library/jest-dom";
import StoreProvider from "@/redux/StoreProvider";


const renderComponent = () => {
  render(
    <StoreProvider>
      <SubscriptionFilter />
    </StoreProvider>
  );
}

describe("Subscription Filter Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and buttons", async () => {
    renderComponent();
    expect(screen.getByLabelText(/Plan name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Plan Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Plan Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Created on/i)).toBeInTheDocument();
    expect(screen.getByText(/Reset/i)).toBeInTheDocument();
  });

  it("handles text input changes correctly", async () => {
    renderComponent();
    const planNameInput = screen.getByLabelText<HTMLInputElement>(/Plan name/i);
    act(() => fireEvent.change(planNameInput, { target: { value: "Test Plan" } }));

    await waitFor(() => {
      expect(planNameInput.value).toBe("Test Plan")
    })
  });

  it("resets all fields when Reset button is clicked", async () => {
    renderComponent();
    const planNameInput = screen.getByLabelText<HTMLInputElement>(/Plan name/i);
    act(() => fireEvent.change(planNameInput, { target: { value: "Test Plan" } }));

    const resetButton = screen.getByText(/Reset/i);
    act(() => fireEvent.click(resetButton));

    await waitFor(() => {
      expect(planNameInput.value).toBe("");
    })
  });
});
