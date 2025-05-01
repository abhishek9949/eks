import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { mockGroupData } from "@/types/chats";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import React, { act } from "react";
import "@testing-library/jest-dom";
import IndividualAccordion from "./IndividualAccordionComponent";
import StoreProvider from "@/redux/StoreProvider";

const mockProps = {
  title: "Groups",
  details: [mockGroupData],
  type: "group",
  userId: 1,
  handleClearGroupChat: jest.fn(),
  handleDeleteGroup: jest.fn(),
  isGlobalChatHistoryLoading: false,
  toggleSidebar: jest.fn()
};

const renderComponent = () => {
  render(
    <StoreProvider>
      <IndividualAccordion {...mockProps} />
    </StoreProvider>,
  );
};

describe("IndividualAccordion Component", () => {
  it("renders the accordion title", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/Groups/)).toBeInTheDocument();
    });
  });

  it("renders the details with correct link", async () => {
    renderComponent();
    await waitFor(() => {
      const link = screen.getAllByTestId("accordion-link")[0];
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        `${URL_CONSTANTS.CHATS}?title=Group chat&messageType=group&id=123`,
      );
    });
  });

  it("shows the loading skeleton when `isGlobalChatHistoryLoading` is true", async () => {
    render(
      <StoreProvider>
        <IndividualAccordion {...mockProps} isGlobalChatHistoryLoading />
      </StoreProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("accordion-skeleton")).toBeInTheDocument(); // Skeleton
    });
  });

  it("opens the group more actions menu when clicking the menu button", async () => {
    renderComponent();

    const moreActionsButton = screen.getByRole("button", { name: /group action button/i });

    await waitFor(() => {
      expect(moreActionsButton).toBeInTheDocument();
    })
  
    act(() =>fireEvent.click(moreActionsButton));
  
    await waitFor(() => {
      expect(screen.getByText(/Delete Group/)).toBeInTheDocument();
    })
  });
});
