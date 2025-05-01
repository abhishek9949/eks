import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactSales from "@/app/auth/contact-sales/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("Contact Sales page", () => {
  beforeEach(() => {
    setMockPathname("/auth/contact-sales");
  });
  it("renders the contact sales page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <ContactSales />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
