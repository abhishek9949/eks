import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@/__mocks__/intersectionObserverMock";

// Create a mock theme
const theme = createTheme();

// Mock scrollTo method for jsdom
Object.defineProperty(window.HTMLElement.prototype, "scrollTo", {
  writable: true,
  value: jest.fn(),
});

describe("Home Page", () => {
  it("should render the LandingPage component", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <Home />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
