"use client";
import React, { useEffect, useState } from "react";
import { NotificationComponent } from "@/components/common/DynamicImports";
import { API_CONSTANTS } from "@/constants/api";
import {
  useDeleteNotificationMutation,
  useLazyGetNotificationListQuery,
  useMarkNotificationAsReadMutation,
} from "@/redux/allReducer";
import { InitialNotificationListDataProps, NotificationListDataProps } from "@/types/notifications";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";

const NotificationsHomePage = () => {
  const [getNotificationList] = useLazyGetNotificationListQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const dispatch = useAppDispatch();
  const [notificationData, setNotificationData] = useState<
    NotificationListDataProps
  >(InitialNotificationListDataProps);
  const [isNotificationListLoading, setIsNotificationListLoading] =
    useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleGetNotificationList = () => {
    setIsNotificationListLoading(true);
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(page));
    queryParams.set("page_size", String(rowsPerPage));
    getNotificationList({
      endpoint: `${API_CONSTANTS.GET_NOTIFICATION_LIST}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((res) => {
        setNotificationData(res?.data);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      })
      .finally(() => {
        setIsNotificationListLoading(false);
      });
  };

  const handleDeleteNotification = (notificationIds: number[]) => {
    deleteNotification({
      endpoint: API_CONSTANTS.DELETE_NOTIFICATION,
      method: "DELETE",
      data: {
        notification_ids: notificationIds,
      },
    })
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            showToastMessage({
              message: "Notification (s) deleted successfully",
              severity: "success",
            }),
          );
          handleGetNotificationList();
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  const handleMarkNotificationAsRead = (notificationIds: number[], showSuccessMessage: boolean) => {
    markNotificationAsRead({
      endpoint: API_CONSTANTS.MARK_NOTIFICATION_AS_READ,
      method: "POST",
      data: {
        notification_ids: notificationIds,
      },
    })
      .unwrap()
      .then((res) => {
        if (res && showSuccessMessage) {
          dispatch(
            showToastMessage({
              message: "Notification (s) marked as read successfully",
              severity: "success",
            }),
          );
          handleGetNotificationList();
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    handleGetNotificationList();
  }, [page, rowsPerPage]);

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage + 1);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <NotificationComponent
      notificationData={notificationData}
      isNotificationListLoading={isNotificationListLoading}
      handleDeleteNotification={handleDeleteNotification}
      handleMarkNotificationAsRead={handleMarkNotificationAsRead}
      page={page}
      rowsPerPage={rowsPerPage}
      handlePageChange={handlePageChange}
      handleRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default NotificationsHomePage;
