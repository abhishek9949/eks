export const InitialNotificationListDataProps = {
  count: 0,
  next: "",
  previous: "",
  results: [
    {
      body: "",
      created_at: "",
      is_read: false,
      notification_id: 1,
      read_at: "",
      title: "",
      icon_url: "",
      target_url: "",
    },
  ],
};

export interface IndividualNotificationProps {
  body: string;
  created_at: string;
  is_read: boolean;
  notification_id: number;
  read_at: string;
  title: string;
  icon_url: string;
  target_url: string;
}

export interface NotificationListDataProps {
  count: number;
  next: string;
  previous: string;
  results: IndividualNotificationProps[];
}

export interface NotificationListResponseProps {
  data: NotificationListDataProps;
  message: string;
  unread_count: number;
}

export interface NotificationComponentProps {
  notificationData: NotificationListDataProps;
  isNotificationListLoading: boolean;
  handleDeleteNotification: (notificationIds: number[]) => void;
  handleMarkNotificationAsRead: (notificationIds: number[], showSuccessMessage: boolean) => void;
  page: number;
  rowsPerPage: number;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IndividualNotificationComponentProps {
  notification: IndividualNotificationProps;
  selectedNotificationIds: number[];
  handleSelectNotification: (notificationId: number) => void;
  handleIndividualNotificationDeletion: (notificationId: number) => void;
  handleIndividualNotificationMarkAsRead: (notificationId: number, showSuccessMessage: boolean) => void;
}
