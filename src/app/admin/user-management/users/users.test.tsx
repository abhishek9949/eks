import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserManagementUserList from "@/app/admin/user-management/users/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

// Create a mock theme
const theme = createTheme();

describe("User management user list page", () => {
  beforeEach(() => {
    setMockPathname("/admin/user-management/users");
  });
  it("renders the user list page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <UserManagementUserList />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
