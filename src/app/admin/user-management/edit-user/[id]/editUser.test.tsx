import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserEditPage from "@/app/admin/user-management/edit-user/[id]/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Channel edit page", () => {
  beforeEach(() => {
    setMockPathname(URL_CONSTANTS.ADMIN_USER_MANAGEMENT_EDIT_USER(123));
  });

  it("renders the Channel edit page with correct id param", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <UserEditPage params={{ id: "123" }} />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
