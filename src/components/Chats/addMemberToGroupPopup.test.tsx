import React, { act } from "react";
import AddMemberToGroupPopup from "./AddMemberToGroupPopup";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StoreProvider from "@/redux/StoreProvider";

const mockHandleCloseAddMemberPopup = jest.fn();
const mockHandleAddMembersToGroup = jest.fn();
const mockGlobalUsersList = [
  { user_id: "1", name: "User One" },
  { user_id: "2", name: "User Two" },
];

jest.mock("@/hooks/useGlobalUsersList", () => ({
  useGlobalUsersList: () => ({ globalUsersList: mockGlobalUsersList }),
}));

const renderComponent = () => {
  render(
    <StoreProvider>
      <AddMemberToGroupPopup
        isAddMemberPopupOpen={true}
        handleCloseAddMemberPopup={mockHandleCloseAddMemberPopup}
        handleAddMembersToGroup={mockHandleAddMembersToGroup}
      />
    </StoreProvider>,
  );
};

describe("Add member to group popup", () => {
  it("should close the popup on click of cancel button", async () => {
    renderComponent();
    act(() => fireEvent.click(screen.getByTestId("add-member-cancel-button")));
    await waitFor(() => {
      expect(mockHandleCloseAddMemberPopup).toHaveBeenCalled();
    });
  });

  it("should call handleAddMembersToGroup with selected members on clicking Add button", async () => {
    renderComponent();

    const autocomplete = screen.getByRole("combobox");
    fireEvent.change(autocomplete, { target: { value: "User One" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    act(() => fireEvent.click(screen.getByTestId("add-member-add-button")));

    await waitFor(() => {
      expect(mockHandleAddMembersToGroup).toHaveBeenCalledWith("POST", {
        add_members: ["1"],
      });
    });
  });

  it("should allow selecting multiple users from the dropdown", async () => {
    renderComponent();

    const autocomplete = screen.getByRole("combobox");
    fireEvent.change(autocomplete, { target: { value: "User One" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    fireEvent.change(autocomplete, { target: { value: "User Two" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });
  });

  it("should clear selected users when the popup is closed", async () => {
    renderComponent();

    const autocomplete = screen.getByRole("combobox");
    fireEvent.change(autocomplete, { target: { value: "User One" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    act(() => fireEvent.click(screen.getByTestId("add-member-cancel-button")));
    await waitFor(() => {
      expect(mockHandleCloseAddMemberPopup).toHaveBeenCalled();
    });
  });

  it("should remove a selected user when clicking the close icon on a chip", async () => {
    renderComponent();

    const autocomplete = screen.getByRole("combobox");
    fireEvent.change(autocomplete, { target: { value: "User One" } });
    fireEvent.keyDown(autocomplete, { key: "ArrowDown" });
    fireEvent.keyDown(autocomplete, { key: "Enter" });

    const chipDeleteButton = screen
      ?.getByText("User One")
      ?.closest("div")
      ?.querySelector("svg");
    fireEvent.click(chipDeleteButton as Element);

    await waitFor(() => {
      expect(screen.queryByText("User One")).not.toBeInTheDocument();
    });
  });
});
