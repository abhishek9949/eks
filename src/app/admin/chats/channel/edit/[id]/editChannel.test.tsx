import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChannelEditPage from "@/app/admin/chats/channel/edit/[id]/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Channel edit page", () => {
  beforeEach(() => {
    setMockPathname(URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_EDIT_CHANNEL(123));
  });

  it("renders the Channel edit page with correct id param", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <ChannelEditPage params={{ id: 123 }} />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
