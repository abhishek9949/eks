import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatManagement from "@/app/admin/chats/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("Chat management page", () => {
  beforeEach(() => {
    setMockPathname("/admin/chats");
  });
  it("renders the chat management page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <ChatManagement />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
