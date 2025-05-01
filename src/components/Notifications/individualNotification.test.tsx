import {
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IndividualNotification from "./IndividualNotification";
import { IndividualNotificationComponentProps } from "@/types/notifications";

const mockHandleSelectNotification = jest.fn();
const mockHandleIndividualNotificationDeletion = jest.fn();
const mockHandleIndividualNotificationMarkAsRead = jest.fn();

const mockNotification = {
  notification_id: 1,
  title: "New course added",
  body: "New content has been uploaded. Please check",
  icon_url: "/svg/account_circle.svg",
  target_url: "/comments",
  created_at: "2025-04-04T10:00:00Z",
  is_read: false,
  read_at: "",
};

const defaultProps: IndividualNotificationComponentProps = {
  notification: mockNotification,
  selectedNotificationIds: [],
  handleSelectNotification: mockHandleSelectNotification,
  handleIndividualNotificationDeletion:
    mockHandleIndividualNotificationDeletion,
  handleIndividualNotificationMarkAsRead:
    mockHandleIndividualNotificationMarkAsRead,
};

const renderComponent = () => {
  render(<IndividualNotification {...defaultProps} />);
};

describe("IndividualNotification Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("hovering shows 'Mark as Read' and 'Delete' icons", async () => {
    render(<IndividualNotification {...defaultProps} />);
    const notificationButton = screen.getByTestId("notification-container");
    await userEvent.hover(notificationButton);
    expect(
      screen.getByTestId("individual-notification-mark-as-read-button"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("delete-individual-notification-button"),
    ).toBeInTheDocument();
  });

  it("clicking 'Mark as Read' calls correct function", async () => {
    renderComponent();

    const notificationButton = screen.getByTestId("notification-container");
    await userEvent.hover(notificationButton);

    const markAsReadButton = screen.getByTestId(
      "individual-notification-mark-as-read-button",
    );
    await userEvent.click(markAsReadButton);

    expect(mockHandleIndividualNotificationMarkAsRead).toHaveBeenCalledWith(1, true);
  });

  it("clicking 'Delete' calls correct function", async () => {
    renderComponent();
    const notificationButton = screen.getByTestId("notification-container");
    await userEvent.hover(notificationButton);

    const deleteButton = screen.getByTestId(
      "delete-individual-notification-button",
    );
    await userEvent.click(deleteButton);
    expect(mockHandleIndividualNotificationDeletion).toHaveBeenCalledWith(1);
  });

  it("renders notification title and body correctly", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("New course added")).toBeInTheDocument();
      expect(
        screen.getByText("New content has been uploaded. Please check"),
      ).toBeInTheDocument();
    });
  });

  it("renders unread notification indicator", async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByTestId("notification-unread-indicator"),
      ).toBeInTheDocument();
    });
  });

  it("clicking checkbox triggers selection", async () => {
    renderComponent();
    await waitFor(() => {
      const checkbox = screen.getByRole("checkbox");
      act(() => userEvent.click(checkbox));
      expect(mockHandleSelectNotification).toHaveBeenCalledWith(1);
    });
  });

  it("renders read notification without unread indicator", async () => {
    render(
      <IndividualNotification
        {...defaultProps}
        notification={{ ...mockNotification, is_read: true }}
      />,
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId("notification-unread-indicator"),
      ).not.toBeInTheDocument(); // No unread indicator
    });
  });
});
