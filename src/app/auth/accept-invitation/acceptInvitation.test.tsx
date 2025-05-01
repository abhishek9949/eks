import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import AcceptInvitationPage from "@/app/auth/accept-invitation/page";
import StoreProvider from "@/redux/StoreProvider";
import {
  setMockPathname,
  setMockSearchParams,
} from "@/__mocks__/nextNavigationMock";

describe("Accept Invitation Page", () => {
  beforeEach(() => {
    setMockPathname("/auth/accept-invitation");
    setMockSearchParams({ email: "test@example.com", token: "12345" });
  });

  it("renders the accept invitation", () => {
    render(
      <StoreProvider>
        <AcceptInvitationPage />
      </StoreProvider>,
    );
  });
});
