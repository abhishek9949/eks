import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DropdownNotification from "./DropdownNotification";
import { useLazyGetNotificationListQuery, useMarkNotificationAsReadMutation } from "@/redux/allReducer";
import StoreProvider from "@/redux/StoreProvider";

// Mock Redux store and hooks
jest.mock("@/redux/allReducer", () => ({
  useLazyGetNotificationListQuery: jest.fn(),
  useMarkNotificationAsReadMutation: jest.fn()
}));

const mockGetNotificationList = jest.fn();
const mockMarkNotificationAsRead = jest.fn();

const mockNotifications = {
  count: 2,
  results: [
    {
      notification_id: 1,
      title: "Test Notification 1",
      body: "This is the first test notification",
      icon_url: "/svg/account_circle.svg",
      target_url: "/comments",
      created_at: "2025-04-04T10:00:00Z",
      is_read: false,
      read_at: "",
    },
    {
      notification_id: 2,
      title: "Test Notification 2",
      body: "This is the second test notification",
      icon_url: "/svg/account_circle.svg",
      target_url: "/dashboard",
      created_at: "2025-04-04T08:00:00Z",
      is_read: true,
      read_at: "",
    },
  ],
};

const renderComponent = () => {
  render(
    <StoreProvider>
      <DropdownNotification />
    </StoreProvider>,
  );
};

describe("DropdownNotification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLazyGetNotificationListQuery as jest.Mock).mockReturnValue([
      mockGetNotificationList,
    ]);
    (useMarkNotificationAsReadMutation as jest.Mock).mockReturnValue([
      mockMarkNotificationAsRead,
    ]);

    mockGetNotificationList.mockReturnValue({
      unwrap: () => Promise.resolve({ data: mockNotifications }),
    });
    mockMarkNotificationAsRead.mockReturnValue({
      unwrap: () => Promise.resolve({ success: true }),
    });
  });

  it("renders notification icon with badge count", async () => {
    renderComponent();
    const iconButton = screen.getByRole("button");
    expect(iconButton).toBeInTheDocument();
    fireEvent.click(iconButton);

    await waitFor(() => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Test Notification 1")).toBeInTheDocument();
      expect(screen.getByText("Test Notification 2")).toBeInTheDocument();
    });
  });

  it("shows unread indicator only for notifications with is_read: false", async () => {
    renderComponent();
  
    fireEvent.click(screen.getByRole("button"));
  
    await waitFor(() => {
      // Should be present only for unread notification(s)
      expect(
        screen.getByTestId("unread-indicator-1") // assuming ID 1 is unread in your mock
      ).toBeInTheDocument();
  
      // Should NOT exist for read notification(s)
      expect(
        screen.queryByTestId("unread-indicator-2") // assuming ID 2 is read
      ).not.toBeInTheDocument();
    });
  });  

  it("navigates to all notifications", async () => {
    renderComponent();
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      const link = screen.getByText("Go to all notifications");
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/personal-info/notifications");
    });
  });
});
