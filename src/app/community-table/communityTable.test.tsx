import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunitytablePage from "@/app/community-table/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import "@/__mocks__/intersectionObserverMock";

// Create a mock theme
const theme = createTheme();

describe("Community table tests", () => {
  beforeEach(() => {
    setMockPathname("/community-table");
  });
  it("renders the community table page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CommunitytablePage />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
