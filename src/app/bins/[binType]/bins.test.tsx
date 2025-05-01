import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BinsPage from "@/app/bins/[binType]/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import "@/__mocks__/intersectionObserverMock";

// Create a mock theme
const theme = createTheme();

describe("Bins tests", () => {
  beforeEach(() => {
    setMockPathname("/bins");
  });

  it("renders the bins page", () => {
    // Mock the params object
    const mockParams = {
      binType: "mybin", // or any other valid bin type
    };

    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <BinsPage params={mockParams} />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});