import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { IndividualMessageComponentProps } from "@/types/chats";
import IndividualMessageComponent from "./IndividualMessageComponent";
import { act } from "react";

const mockMessage = {
  id: 1,
  text: "hello",
  sender: {
    id: 123,
    name: "Test",
    profile_image: "",
  },
  timestamp: "2025",
  uniqueId: "",
  isLocal: false,
  type: "private"
};

const mockProps: IndividualMessageComponentProps = {
  message: mockMessage,
  userId: 123,
  setIsReplyMessage: jest.fn(),
  setSelectedMessage: jest.fn(),
  handleDeleteMessage: jest.fn(),
  messageType: "private"
};


const renderComponent = () => {
  render(<IndividualMessageComponent {...mockProps} />);
}

describe("IndividualMessageComponent", () => {
  it("renders the message text correctly", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/hello/)).toBeInTheDocument();
    })
  });

  it("opens more actions menu when clicking MoreVert button", async () => {
    renderComponent();
    await waitFor(() => {
      const moreActionsButton = screen.getByTestId("individual-message-more-actions");
      expect(moreActionsButton).toBeInTheDocument();
      act(() => fireEvent.click(moreActionsButton));
      expect(screen.getByText(/Edit/)).toBeVisible();
      expect(screen.getByText(/Delete/)).toBeVisible();
    })
  });
});
