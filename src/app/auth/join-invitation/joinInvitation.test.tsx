import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import JoinInvitationPage from "@/app/auth/join-invitation/page";
import StoreProvider from "@/redux/StoreProvider";
import {
  setMockPathname,
  setMockSearchParams,
} from "@/__mocks__/nextNavigationMock";

describe("Join Invitation Page", () => {
  beforeEach(() => {
    setMockPathname("/auth/join-invitation");
    setMockSearchParams({ email: "test@example.com", token: "12345" });
  });

  it("renders the join invitation form", () => {
    render(
      <StoreProvider>
        <JoinInvitationPage />
      </StoreProvider>,
    );

    // Check if the title and form elements are present
    expect(screen.getByTestId("join-invitation-title")).toBeInTheDocument();
    expect(
      screen.getByTestId("join-invitation-email-field"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("join-invitation-newpassword-field"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("join-invitation-confirm-password-field"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("join-invitation-submit")).toBeInTheDocument();
  });

  it("validates join invitation form fields", async () => {
    render(
      <StoreProvider>
        <JoinInvitationPage />
      </StoreProvider>,
    );

    const submitButton = screen.getByTestId("join-invitation-submit");
    fireEvent.click(submitButton);

    // Check for validation errors
    expect(
      await screen.findByText(/New Password is required/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Confirm Password is required/i),
    ).toBeInTheDocument();
  });
});
