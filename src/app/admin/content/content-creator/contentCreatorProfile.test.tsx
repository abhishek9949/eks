import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContentCreatorProfile from "@/app/admin/content/content-creator/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Content creator profile page", () => {
  beforeEach(() => {
    setMockPathname(URL_CONSTANTS.ADMIN_CONTENT_CREATOR_PROFILE);
  });
  it("renders the Content creator profile page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <ContentCreatorProfile />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
