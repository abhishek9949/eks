import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import NewChatPopup from "./NewChatPopup";
import StoreProvider from "@/redux/StoreProvider";

const mockSearchResults = [
  {
    chat_type: "private",
    email: "test.user@test.com",
    first_name: "Test",
    id: 123,
    last_name: "User",
    profile_image: "",
    username: "test user",
    group_id: 0,
    group_name: "",
    channel_id: 0,
    channel_name: "",
  },
];

const mockProps = {
  handleOnClickCreateGroup: jest.fn(),
  getSearchGlobalChatDetails: jest.fn(),
  searchedGlobalChatDetailsResult: mockSearchResults,
  toggleNewChatPopup: jest.fn(),
  isSearchGlobalChatDetailLoading: false,
  userId: 123,
};

describe("new chat popup component", () => {
  it("renders the component", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} />
      </StoreProvider>,
    );
    expect(
      screen.getByPlaceholderText(/Search for people, groups or channels/i),
    ).toBeInTheDocument();
  });

  it("do not display close icon if there is no search text", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} />
      </StoreProvider>,
    );
    expect(screen.queryByTestId("search-close-icon")).not.toBeInTheDocument();
  });

  it("updates and clears search input", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} />
      </StoreProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      /Search for people, groups or channels/i,
    );
    act(() => fireEvent.change(searchInput, { target: { value: "User" } }));
    expect(searchInput).toHaveValue("User");

    act(() => fireEvent.click(screen.getByTestId("search-close-icon")));
    expect(searchInput).toHaveValue("");
  });

  it("if there is a search input and the api is loading display skeleton loader", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} isSearchGlobalChatDetailLoading={true} />
      </StoreProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      /Search for people, groups or channels/i,
    );
    act(() => fireEvent.change(searchInput, { target: { value: "User" } }));
    expect(searchInput).toHaveValue("User");
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });

  it("if there is a search input there are no search results display 'no data found'", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} searchedGlobalChatDetailsResult={[]} />
      </StoreProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      /Search for people, groups or channels/i,
    );
    act(() => fireEvent.change(searchInput, { target: { value: "Jane" } }));
    expect(searchInput).toHaveValue("Jane");
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });

  it("displays search results correctly with the icon with respect to the type", () => {
    render(
      <StoreProvider>
        <NewChatPopup {...mockProps} />
      </StoreProvider>,
    );

    const searchInput = screen.getByPlaceholderText(
      /Search for people, groups or channels/i,
    );
    act(() => fireEvent.change(searchInput, { target: { value: "User" } }));
    expect(searchInput).toHaveValue("User");
    expect(screen.getByText(/test.user@test.com/i)).toBeInTheDocument();
    expect(screen.getByTestId("custom-avatar")).toBeInTheDocument();
  });
});
