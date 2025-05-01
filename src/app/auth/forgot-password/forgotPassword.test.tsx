import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPasswordPage from "@/app/auth/forgot-password/page";
import StoreProvider from "@/redux/StoreProvider";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

describe("Forgot password Page", () => {
  beforeEach(() => {
    setMockPathname("/auth/forgot-password");
  });
  it("renders the forgot password form", () => {
    render(
      <StoreProvider>
        <ForgotPasswordPage />
      </StoreProvider>,
    );

    // Check if the title and form elements are present
    expect(screen.getByTestId("forgot-password-title")).toBeInTheDocument();
    expect(
      screen.getByTestId("forgot-password-email-field"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-submit")).toBeInTheDocument();
  });

  it("validates forgot passowrd form field", async () => {
    render(
      <StoreProvider>
        <ForgotPasswordPage />
      </StoreProvider>,
    );

    const submitButton = screen.getByTestId("forgot-password-submit");
    fireEvent.click(submitButton);

    // Check for validation errors
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });
});
