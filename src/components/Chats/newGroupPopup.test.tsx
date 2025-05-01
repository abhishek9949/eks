import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import NewGroupPopup from "./NewGroupPopup";
import StoreProvider from "@/redux/StoreProvider";

const mockProps = {
  openNewGroupPopup: true,
  handleCloseNewGroupPopup: jest.fn(),
  handleCreateGroup: jest.fn(),
};

describe("new group popup component", () => {
  it("renders the component", () => {
    render(
      <StoreProvider>
        <NewGroupPopup {...mockProps} />
      </StoreProvider>,
    );
    expect(screen.getByText(/create a group/i)).toBeInTheDocument();
  });

  it("textfield input changes accrodingly", async () => {
    render(
      <StoreProvider>
        <NewGroupPopup {...mockProps} />
      </StoreProvider>,
    );
    const textfield = screen.getByPlaceholderText(/group name/i);
    act(() => fireEvent.change(textfield, { target: { value: "test group" } }));
    await waitFor(() => {
      expect(textfield).toHaveValue("test group");
    });
  });

  it("create button is disabled until group name is entered", async () => {
    render(
      <StoreProvider>
        <NewGroupPopup {...mockProps} />
      </StoreProvider>,
    );
    const createButton = screen.getByTestId("new-group-create-button");
    expect(createButton).toBeDisabled();

    const textfield = screen.getByPlaceholderText(/group name/i);
    act(() => fireEvent.change(textfield, { target: { value: "test group" } }));
    await waitFor(() => {
      expect(createButton).not.toBeDisabled();
    });
  });

  it("'handleCloseNewGroupPopup' function is called on click of cancel button", async () => {
    render(
      <StoreProvider>
        <NewGroupPopup {...mockProps} />
      </StoreProvider>,
    );
    const cancelButton = screen.getByTestId("new-group-cancel-button");
    act(() => fireEvent.click(cancelButton));
    await waitFor(() => {
      expect(mockProps.handleCloseNewGroupPopup).toHaveBeenCalled();
    })
  });
});
