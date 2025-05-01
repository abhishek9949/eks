"use client";
import {
  IndividualNotificationProps,
  NotificationComponentProps,
} from "@/types/notifications";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TablePagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import IndividualNotification from "./IndividualNotification";
import { Delete, DoneAllOutlined } from "@mui/icons-material";
import NotificationListSkeleton from "./NotificationListSkeleton";
import ModalDialog from "@/components/common/ModalDialog";
import { areArraysEqualAsSets } from "@/utils/reusableFunctions";

const Notifications = ({
  notificationData,
  isNotificationListLoading,
  handleDeleteNotification,
  handleMarkNotificationAsRead,
  page,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
}: NotificationComponentProps) => {
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<
    number[]
  >([]);
  const [isDeleteNotificationPopupOpen, setIsDeleteNotificationPopupOpen] =
    useState(false);
  const [isIndividualNotificationDelete, setIsIndividualNotificationDelete] =
    useState(false);
  const [notificationIds, setNotificationIds] = useState<number[]>([]); // to check if all notifications are checked
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  useEffect(() => {
    const notificationIdsTemp = notificationData?.results?.map(
      (notification) => notification?.notification_id,
    );
    setNotificationIds(notificationIdsTemp);
  }, [notificationData]);

  const handleOnClickSelectAll = () => {
    setIsSelectAll(!isSelectAll);
  };

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotificationIds((prev) =>
      prev?.includes(notificationId)
        ? prev?.filter((id) => notificationId !== id)
        : [...prev, notificationId],
    );
  };

  useEffect(() => {
    if (isSelectAll) {
      setSelectedNotificationIds(notificationIds);
    } else {
      setSelectedNotificationIds([]);
    }
  }, [isSelectAll]);

  const toggleDeleteNotificationPopup = () => {
    setIsDeleteNotificationPopupOpen(!isDeleteNotificationPopupOpen);
  };

  const handleConfirmDeleteNotification = () => {
    toggleDeleteNotificationPopup();
    handleDeleteNotification(selectedNotificationIds);
  };

  const getDeleteDialogDescription = () => {
    if (selectedNotificationIds?.length > 1) {
      return "Are you sure you want to delete these notifications?";
    } else {
      return "Are you sure you want to delete this notification?";
    }
  };

  const handleMarkAsRead = () => {
    handleMarkNotificationAsRead(selectedNotificationIds, true);
  };

  const handleIndividualNotificationDeletion = (notificationId: number) => {
    setIsIndividualNotificationDelete(!isIndividualNotificationDelete);
    setSelectedNotificationIds([notificationId]);
    setIsDeleteNotificationPopupOpen(!isDeleteNotificationPopupOpen);
  };

  const handleCloseIndividualNotificationDeletePopup = () => {
    setIsIndividualNotificationDelete(!isIndividualNotificationDelete);
    setSelectedNotificationIds([]);
    setIsDeleteNotificationPopupOpen(!isDeleteNotificationPopupOpen);
  };

  const handleIndividualNotificationMarkAsRead = (notificationId: number, showSuccessMessage: boolean) => {
    handleMarkNotificationAsRead([notificationId], showSuccessMessage);
  };

  useEffect(() => {
    setIsSelectAllChecked(
      areArraysEqualAsSets(notificationIds, selectedNotificationIds),
    );
  }, [selectedNotificationIds]);

  return (
    <>
      {notificationData?.results?.length === 0 ? (
        <div className="flex items-center justify-center p-20">
          <p className="text-2xl text-black">No notifications</p>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              <FormControlLabel
                control={
                  <Checkbox
                    onClick={handleOnClickSelectAll}
                    disabled={isNotificationListLoading}
                    checked={isSelectAll || isSelectAllChecked}
                  />
                }
                label="Select all"
              />
            </div>
            {/* Notification Operations */}
            {selectedNotificationIds?.length > 0 &&
              !isIndividualNotificationDelete && (
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<DoneAllOutlined />}
                    disableRipple
                    onClick={handleMarkAsRead}
                    data-testid="mark-as-read-button"
                  >
                    {isSelectAll ? "Mark all as Read" : "Mark as Read"}
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    disableRipple
                    onClick={toggleDeleteNotificationPopup}
                    data-testid="delete-notification-button"
                  >
                    Delete
                  </Button>
                </div>
              )}
          </div>
          {/* Individual Notification */}
          {isNotificationListLoading ? (
            <NotificationListSkeleton />
          ) : (
            <div className="no-scrollbar flex h-[70vh] flex-col overflow-auto">
              {notificationData?.results?.map(
                (notification: IndividualNotificationProps) => (
                  <IndividualNotification
                    notification={notification}
                    key={notification?.notification_id}
                    selectedNotificationIds={selectedNotificationIds}
                    handleSelectNotification={handleSelectNotification}
                    handleIndividualNotificationDeletion={
                      handleIndividualNotificationDeletion
                    }
                    handleIndividualNotificationMarkAsRead={
                      handleIndividualNotificationMarkAsRead
                    }
                  />
                ),
              )}
            </div>
          )}
          <TablePagination
            component="div"
            count={notificationData?.count}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            disabled={isNotificationListLoading}
          />
        </div>
      )}
      <ModalDialog
        dialogTitle="Delete Notification"
        dialogDescription={getDeleteDialogDescription()}
        openDialog={isDeleteNotificationPopupOpen}
        handleCloseDialog={
          isIndividualNotificationDelete
            ? handleCloseIndividualNotificationDeletePopup
            : toggleDeleteNotificationPopup
        }
        handleConfirm={handleConfirmDeleteNotification}
      />
    </>
  );
};

export default Notifications;
