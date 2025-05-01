import { render, screen } from "@testing-library/react";
import React from "react";
import MessageSearchResultsComponent from "./MessageSearchResultsComponent";

const mockDiv = document.createElement("div");

const mockContentLoaderRef = {
  current: mockDiv,
} as React.RefObject<HTMLDivElement>;

const mockSearchResults = [
  {
    ably_channel: 2,
    is_read: true,
    message: "hello",
    message_id: 1,
    message_status: "",
    message_type: "text",
    parent_id: 0,
    recipient: {
      email: "test.recipient@test.com",
      first_name: "test",
      last_name: "user 1",
      profile_image: "",
      user_id: 10,
    },
    sender: {
      email: "test.sender@test.com",
      first_name: "test",
      last_name: "user 2",
      profile_image: "",
      user_id: 20,
    },
    type: "group",
    unique_id: "",
    unread_count: 0,
    group_name: "",
    group_id: 0,
    group_message_id: 0,
    channel_name: "",
    channel_id: 0,
    updated_at: "",
    created_by: {
      email: "test.sender@test.com",
      first_name: "test",
      last_name: "user 2",
      profile_image: "",
      user_id: 20,
    },
    created_at: "",
  },
];

const mockProps = {
  searchResults: mockSearchResults,
  userId: 123,
  searchResultsCount: 1,
  contentLoaderRef: mockContentLoaderRef,
  isSearchMessageLoading: false,
  messageType: "private",
  recipientId: "456",
};

describe("message search result component", () => {
  it("renders the component", () => {
    render(<MessageSearchResultsComponent {...mockProps} />);
    expect(screen.getByText(/found 1 results/i)).toBeInTheDocument();
  });

  it("display 'no data found' if search results array is empty", () => {
    render(<MessageSearchResultsComponent {...mockProps} searchResults={[]} />);
    expect(screen.getByText(/no data found/i)).toBeInTheDocument();
  });

  it("displays search message correctly", () => {
    render(<MessageSearchResultsComponent {...mockProps} />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it("displays group icon(respective to the type of message)", () => {
    render(<MessageSearchResultsComponent {...mockProps} />);
    expect(screen.getByTestId("group-icon")).toBeInTheDocument();
  });

  it("displays loader is api is loading)", () => {
    render(<MessageSearchResultsComponent {...mockProps} searchResults={[...Array(1).fill(null)]} />);
    expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  });
});
