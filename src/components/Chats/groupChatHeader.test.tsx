import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GroupChatHeaderProps } from "@/types/chats";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import GroupChatHeader from "./GroupChatHeader";
import { act } from "react";

const mockProps: GroupChatHeaderProps = {
  groupDetails: {
    created_by: 1,
    group_id: 123,
    group_name: "Test",
    is_blocked: false,
    is_public: true,
    members: 2,
    organization_id: 2
  },
  userId: 1,
  handleDeleteGroup: jest.fn(),
  handleLeaveGroup: jest.fn(),
};

const renderComponent = () => {
  render (
    <GroupChatHeader {...mockProps} />
  )
}

describe("GroupChatHeader Component", () => {
  it("renders the group name and member count", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("2 Members")).toBeInTheDocument();
      expect(screen.getByText("Public")).toBeInTheDocument();
    })

  });

  it("opens the dropdown menu", async () => {
    renderComponent();
    const menuButton = screen.getByTestId("group-chat-more-actions");
    // Open menu
    act(() => fireEvent.click(menuButton));
    await waitFor(() => expect(screen.getByText("Manage Members")).toBeInTheDocument());
  });

  it("navigates to manage members on clicking the option", async () => {
    renderComponent();
    act(() => fireEvent.click(screen.getByTestId("group-chat-more-actions")));

    await waitFor(() => {
      const manageMembersLink = screen.getByText("Manage Members").closest("a");
      expect(manageMembersLink).toHaveAttribute(
        "href",
        `${URL_CONSTANTS.MANAGE_MEMBERS}?title=Test&id=123&messageType=group&createdBy=1`
      );
    })

  });

  it("displays and confirms the delete group modal", async () => {
    renderComponent();
    act(() => fireEvent.click(screen.getByTestId("group-chat-more-actions")));

    // Click "Delete" option
    act(() => fireEvent.click(screen.getByText("Delete")));
    await waitFor(() => expect(screen.getByText("Are you sure you want to delete this group?")).toBeInTheDocument());

    // Confirm delete
    act(() => fireEvent.click(screen.getByRole("button", { name: "Yes" })));
    waitFor(() => expect(mockProps.handleDeleteGroup).toHaveBeenCalledWith(1));
  });

  it("displays and confirms the leave group modal (when user is not admin)", async () => {
    render(<GroupChatHeader {...{ ...mockProps, userId: 10 }} />);
    act(() => fireEvent.click(screen.getByTestId("group-chat-more-actions")));

    // Click "Leave" option
    act(() => fireEvent.click(screen.getByText("Leave")));
    await waitFor(() => expect(screen.getByText("Are you sure you want to leave this group?")).toBeInTheDocument());

    // Confirm leave
    act(() => fireEvent.click(screen.getByRole("button", { name: "Yes" })));
    await waitFor(() =>expect(mockProps.handleLeaveGroup).toHaveBeenCalledWith(123));
  });
});
