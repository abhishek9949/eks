import {
  render,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import Notifications from "./index";
import { NotificationComponentProps } from "@/types/notifications";

const mockHandleDeleteNotification = jest.fn();
const mockHandleMarkNotificationAsRead = jest.fn();
const mockHandlePageChange = jest.fn();
const mockHandleRowsPerPageChange = jest.fn();

const mockNotificationData = {
  count: 3,
  results: [
    {
      body: "Checkout the new content uploaded",
      created_at: "2025-04-03T10:20:19.997381Z",
      is_read: false,
      notification_id: 1,
      read_at: "",
      title: "New content uploaded",
      icon_url: "/svg/account_circle.svg",
      target_url: "",
    },
    {
      body: "Checkout the new community added",
      created_at: "2025-04-03T10:20:19.997381Z",
      is_read: true,
      notification_id: 2,
      read_at: "",
      title: "New community added",
      icon_url: "/svg/account_circle.svg",
      target_url: "",
    },
    {
      body: "Checkout the new bin created",
      created_at: "2025-04-03T10:20:19.997381Z",
      is_read: false,
      notification_id: 3,
      read_at: "",
      title: "New bin created",
      icon_url: "",
      target_url: "/svg/account_circle.svg",
    },
  ],
  next: "",
  previous: "",
};

const defaultProps: NotificationComponentProps = {
  notificationData: mockNotificationData,
  isNotificationListLoading: false,
  handleDeleteNotification: mockHandleDeleteNotification,
  handleMarkNotificationAsRead: mockHandleMarkNotificationAsRead,
  page: 1,
  rowsPerPage: 5,
  handlePageChange: mockHandlePageChange,
  handleRowsPerPageChange: mockHandleRowsPerPageChange,
};

const renderComponent = () => {
  render(<Notifications {...defaultProps} />);
};

describe("Notifications Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders notifications correctly", () => {
    renderComponent();
    expect(screen.getByText("New content uploaded")).toBeInTheDocument();
    expect(
      screen.getByText("Checkout the new community added"),
    ).toBeInTheDocument();
    expect(screen.getByText("New bin created")).toBeInTheDocument();
  });

  it("renders empty state when no notifications exist", () => {
    render(
      <Notifications
        {...defaultProps}
        notificationData={{ count: 0, results: [], next: "", previous: "" }}
      />,
    );

    expect(screen.getByText("No notifications")).toBeInTheDocument();
  });

  it("handles 'Select all' checkbox functionality", () => {
    renderComponent();

    const selectAllCheckbox = screen.getByLabelText(/select all/i);
    act(() => fireEvent.click(selectAllCheckbox));
    expect(selectAllCheckbox).toBeChecked();
  });

  it("hide 'mark as read' and 'delete' button if no notification is selected", () => {
    renderComponent();

    expect(
      screen.queryByTestId("delete-notification-button"),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("mark-as-read-button")).not.toBeInTheDocument();
  });

  it("show 'mark as read' and 'delete' button if atleast one notification is selected", () => {
    renderComponent();

    act(() => fireEvent.click(screen.getAllByRole("checkbox")[1]));
    expect(
      screen.getByTestId("delete-notification-button"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mark-as-read-button")).toBeInTheDocument();
  });

  it("calls delete function when clicking delete button", () => {
    renderComponent();

    // Select first notification
    act(() => fireEvent.click(screen.getAllByRole("checkbox")[1]));

    // Click delete button
    const deleteButton = screen.getByTestId("delete-notification-button");
    act(() => fireEvent.click(deleteButton));

    // Confirm deletion
    const confirmDeleteButton = screen.getByRole("button", {
      name: /yes/i,
    });
    act(() => fireEvent.click(confirmDeleteButton));

    expect(mockHandleDeleteNotification).toHaveBeenCalledWith([1]); // ID of selected notification
  });

  it("calls mark as read function", () => {
    renderComponent();

    act(() => fireEvent.click(screen.getAllByRole("checkbox")[1]));

    // Click "Mark as Read" button
    const markAsReadButton = screen.getByTestId("mark-as-read-button");
    act(() => fireEvent.click(markAsReadButton));

    expect(mockHandleMarkNotificationAsRead).toHaveBeenCalledWith([1], true);
  });

  it("display skeleton while the notification list is loading", () => {
    render(
      <Notifications {...defaultProps} isNotificationListLoading={true} />,
    );
    expect(screen.getByTestId("notification-skeleton")).toBeInTheDocument();
  });
});
