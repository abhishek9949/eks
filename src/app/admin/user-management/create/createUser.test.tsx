import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserManagementCreateUser from "@/app/admin/user-management/create/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";

const theme = createTheme();

describe("User management create user page", () => {
  beforeEach(() => {
    setMockPathname("/admin/user-management/create");
  });
  it("renders the create user page", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <UserManagementCreateUser />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
