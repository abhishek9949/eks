import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import BlockedChannelList from "@/app/admin/chats/channel/blocked/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Blocked Channel List management page", () => {
  beforeEach(() => {
    setMockPathname(URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_BLOCKED_CHANNEL);
  });
  it("renders the Blocked Channel list management page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <BlockedChannelList />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
