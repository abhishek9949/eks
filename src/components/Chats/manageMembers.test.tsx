import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import ManageMembers from "./ManageMembers";
import { GroupMembersDetailResponse } from "@/types/chats";
import StoreProvider from "@/redux/StoreProvider";

const membersData : GroupMembersDetailResponse = {
  data: {
    count: 2,
    next: "",
    previous: "",
    results: [
      {
        email: "test.user1@gm.com",
        group_id: 12,
        group_member_id: 1,
        profile: "",
        role: "owner",
        user_id: 123,
        user_name: "Test User 1"
      },
      {
        email: "test.user2@gm.com",
        group_id: 12,
        group_member_id: 2,
        profile: "",
        role: "member",
        user_id: 456,
        user_name: "Test User 2"
      }
    ]
  },
  message: "",
  total_members: 2
}

const mockProps = {
  title:"Test group",
  membersData,
  isLoading: false,
  handleAddOrRemoveMembersFromGroup: jest.fn(),
  createdBy: "123",
  page: 1,
  rowsPerPage:5,
  handlePageChange: jest.fn(),
  handleRowsPerPageChange: jest.fn(),
  userId: 123
}

describe("manage members component", () => {
  it("renders component", async () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
        />
      </StoreProvider>
    )
    await waitFor(() => {
      expect(screen.getByText(/test group/i)).toBeInTheDocument();
    })
  })

  it("displays the member details", async () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
        />
      </StoreProvider>
    )
    await waitFor(() => {
      expect(screen.getByText(/test user 1/i)).toBeInTheDocument();
      expect(screen.getByText(/test.user1@gm.com/i)).toBeInTheDocument();
      expect(screen.getByText(/test user 2/i)).toBeInTheDocument();
      expect(screen.getByText(/test.user2@gm.com/i)).toBeInTheDocument();
    })
  })

  it("add member and remove member should be disabled if the user is not group admin", async () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
          createdBy="456"
        />
      </StoreProvider>
    )
    await waitFor(() => {
      const addMemberButton = screen.getByTestId("add-member-button");
      expect(addMemberButton).toBeDisabled();
      const removeMemberButton = screen.getByTestId("remove-member-button");
      expect(removeMemberButton).toBeDisabled();
    })
  })

  it("checkbox should be displayed only for non-admins rows", async () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
        />
      </StoreProvider>
    )
    await waitFor(() => {
     const checkbox = screen.getAllByTestId("member-checkbox");
     expect(checkbox.length).toBe(1);
    })
  })

  it("checkbox should be disabled for non-admins", async () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
          createdBy="456"
        />
      </StoreProvider>
    )
    await waitFor(() => {
     const checkbox = screen.getByTestId("member-checkbox");
     expect(checkbox).toHaveClass("Mui-disabled");
    })
  })
  it("updates and clears search input", () => {
    render(
      <StoreProvider>
        <ManageMembers
          {...mockProps}
          createdBy="456"
        />
      </StoreProvider>
    )
  
    const searchInput = screen.getByPlaceholderText("Search members");
    act(() => fireEvent.change(searchInput, { target: { value: "Jane" } }));
    expect(searchInput).toHaveValue("Jane");
  
    act(() => fireEvent.click(screen.getByTestId("search-clear-button")));
    expect(searchInput).toHaveValue("");
  });
})