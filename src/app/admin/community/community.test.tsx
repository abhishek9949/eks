import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunityManagement from "@/app/admin/community/view/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("Community management", () => {
  beforeEach(() => {
    setMockPathname("/admin/community");
  });
  it("renders the community management", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CommunityManagement />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
