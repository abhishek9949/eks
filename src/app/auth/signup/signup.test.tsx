import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import SignupPage from "@/app/auth/signup/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("Signup Page", () => {
  beforeEach(() => {
    setMockPathname("/auth/signup");
  });

  it("renders the signup page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <SignupPage />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
