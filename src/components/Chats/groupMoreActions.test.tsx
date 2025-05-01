import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GroupMoreActions from "./GroupMoreActions";
import { act, useState } from "react";
import StoreProvider from "@/redux/StoreProvider";
import { mockGroupData } from "@/types/chats";

const mockHandleDeleteGroup = jest.fn();
const mockHandleClearGroupChat = jest.fn();

const MockWrapper = ({ userId = 1 }: { userId?: number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

  return (
    <div>
      {/* Button to trigger menu */}
      <button
        data-testid="open-menu-button"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Open Menu
      </button>

      <GroupMoreActions
        openGroupMoreActions={anchorEl}
        handleCloseGroupMoreActions={() => setAnchorEl(null)}
        handleDeleteGroup={mockHandleDeleteGroup}
        handleClearGroupChat={mockHandleClearGroupChat}
        currentRow={mockGroupData}
        userId={userId}
      />
    </div>
  );
};

describe("GroupMoreActions", () => {
  const renderComponent = () => {
    render(
      <StoreProvider>
        <MockWrapper />
      </StoreProvider>,
    );
  };

  it("renders menu items when opened", async () => {
    renderComponent();
    const button = screen.getByTestId("open-menu-button");
    act(() => fireEvent.click(button));

    await waitFor(() => {
      expect(screen.getByText(/Delete Group/)).toBeInTheDocument();
      expect(screen.getByText(/Clear Chat/)).toBeInTheDocument();
    });
  });

  it("calls handleDeleteGroup when clicking Delete Group", async () => {
    renderComponent();

    const button = screen.getByTestId("open-menu-button");
    act(() => fireEvent.click(button));

    const deleteButton = screen.getByText(/Delete Group/);
    act(() => fireEvent.click(deleteButton));

    await waitFor(() =>
      expect(
        screen.getByText("Are you sure you want to delete this group?"),
      ).toBeInTheDocument(),
    );

    // Confirm delete
    act(() => fireEvent.click(screen.getByRole("button", { name: "Yes" })));

    await waitFor(() =>
      expect(mockHandleDeleteGroup).toHaveBeenCalledWith(123),
    );
  });

  it("calls handleClearGroupChat when clicking Clear Chat", async () => {
    renderComponent();

    const button = screen.getByTestId("open-menu-button");
    act(() => fireEvent.click(button));

    const clearChatButton = screen.getByText(/Clear Chat/);
    act(() => fireEvent.click(clearChatButton));

    await waitFor(() =>
      expect(
        screen.getByText("Are you sure you want to clear the chat?"),
      ).toBeInTheDocument(),
    );

    // Confirm delete
    act(() => fireEvent.click(screen.getByRole("button", { name: "Yes" })));

    await waitFor(() =>
      expect(mockHandleClearGroupChat).toHaveBeenCalledWith(123),
    );
  });

  it("does not show Delete Group option if user is not an admin", async () => {
    render(
      <StoreProvider>
        <MockWrapper userId={3} />
      </StoreProvider>,
    );

    const button = screen.getByTestId("open-menu-button");
    act(() => fireEvent.click(button));

    await waitFor(() => {
      expect(screen.queryByText(/Delete Group/)).not.toBeInTheDocument();
      expect(screen.getByText(/Clear Chat/)).toBeInTheDocument();
    });
  });

  it("closes the menu when handleCloseGroupMoreActions is triggered", async () => {
    renderComponent();
    const button = screen.getByTestId("open-menu-button");
    act(() => fireEvent.click(button));

    act(() => fireEvent.click(screen.getByText(/Clear Chat/)));
    await waitFor(() => expect(mockHandleClearGroupChat).toHaveBeenCalled());
  });
});
