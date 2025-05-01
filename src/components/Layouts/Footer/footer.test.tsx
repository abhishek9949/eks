import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from ".";
import StoreProvider from "@/redux/StoreProvider";

describe("Footer tests", () => {
  it("Footer rendering", () => {
    render(
      <StoreProvider>
        <Footer />
      </StoreProvider>,
    );

    expect(screen.getByTestId("footer-email-field")).toBeInTheDocument();
    expect(screen.getByTestId("footer-links")).toBeInTheDocument();
  });

  it("validates footer email field", async () => {
    render(
      <StoreProvider>
        <Footer />
      </StoreProvider>,
    );

    const submitButton = screen.getByTestId("footer-email-submit");
    fireEvent.click(submitButton);

    // Check for validation errors
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });
});
