import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateChannel from "@/app/admin/chats/channel/create/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Create channel admin management page", () => {
  beforeEach(() => {
    setMockPathname(URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_CHANNEL);
  });
  it("renders the Create channel admin management page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CreateChannel />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
