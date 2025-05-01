import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import PreviewContentCreatorProfile from "@/app/admin/user-management/preview-content-creator/[id]/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Preview content creator page", () => {
  beforeEach(() => {
    setMockPathname(
      URL_CONSTANTS.ADMIN_USER_MANAGEMENT_PREVIEW_CONTENT_CREATOR,
    );
  });

  it("renders the Preview content creator with correct id param", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <PreviewContentCreatorProfile params={{ id: 123 }} />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
