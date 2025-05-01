import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginPage from "@/app/auth/login/page";
import StoreProvider from "@/redux/StoreProvider";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

describe("Login Page", () => {
  beforeEach(() => {
    setMockPathname("/auth/login");
  });

  it("renders the login form", () => {
    render(
      <StoreProvider>
        <LoginPage />
      </StoreProvider>,
    );

    expect(screen.getByTestId("login-title")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("validates form fields on login page", async () => {
    render(
      <StoreProvider>
        <LoginPage />
      </StoreProvider>,
    );

    const loginButton = screen.getByTestId("login-button");
    fireEvent.click(loginButton);

    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i),
    ).toBeInTheDocument();
  });
});
