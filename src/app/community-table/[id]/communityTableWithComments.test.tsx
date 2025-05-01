import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import CommunityTableWithCommentsPage from "@/app/community-table/[id]/page";
import StoreProvider from "@/redux/StoreProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { setMockPathname } from "@/__mocks__/nextNavigationMock";
import { URL_CONSTANTS } from "@/constants/routingUrl";

// Create a mock theme
const theme = createTheme();

describe("Community Table With Comments Page", () => {
  beforeEach(() => {
    setMockPathname(`${URL_CONSTANTS.COMMUNITY_TABLE}/123`);
  });

  it("renders the Community Table With Comments Page with correct id param", () => {
    render(
      <ThemeProvider theme={theme}>
        <StoreProvider>
          <CommunityTableWithCommentsPage params={{ id: "123" }} />
        </StoreProvider>
      </ThemeProvider>,
    );
  });
});
