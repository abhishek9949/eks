import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunityManagementReportedComments from "@/app/admin/community/reported-comments/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("Community management reported comments", () => {
  beforeEach(() => {
    setMockPathname("/admin/community/reported-comments");
  });
  it("renders the reported comments page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CommunityManagementReportedComments />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
