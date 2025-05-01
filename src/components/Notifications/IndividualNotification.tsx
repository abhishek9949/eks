"use client";
import React, { useState } from "react";
import { IndividualNotificationComponentProps } from "@/types/notifications";
import Image from "next/image";
import { Checkbox } from "@mui/material";
import clsx from "clsx";
import { Delete, DoneAllOutlined } from "@mui/icons-material";
import {
  getTimeFromTimestamp,
  timeDifference,
} from "@/utils/reusableFunctions";
import Link from "next/link";

const IndividualNotification = ({
  notification,
  selectedNotificationIds,
  handleSelectNotification,
  handleIndividualNotificationDeletion,
  handleIndividualNotificationMarkAsRead,
}: IndividualNotificationComponentProps) => {
  const isNotificationSelected = selectedNotificationIds?.includes(
    notification?.notification_id,
  );
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);

  const handleCheckboxClick = () => {
    handleSelectNotification(notification?.notification_id);
  };

  const handleOnClickIndividualNotificationDelete = () => {
    handleIndividualNotificationDeletion(notification?.notification_id);
  };

  const handleOnClickIndividualNotificationMarkAsRead = (showSuccessMessage: boolean) => {
    handleIndividualNotificationMarkAsRead(notification?.notification_id, showSuccessMessage);
  };

  return (
    <button
      className={clsx(
        "border-b-solid flex items-center justify-between gap-4 border-b px-2 py-4 hover:bg-gray-200/40 hover:shadow-notification",
        isNotificationSelected && "bg-sky-50 shadow-notification",
      )}
      onMouseEnter={() => setIsNotificationHovered(true)}
      onMouseLeave={() => setIsNotificationHovered(false)}
      data-testid="notification-container"
    >
      <div className="flex items-center gap-4 w-full">
        <Checkbox
          className="h-6 w-6"
          checked={isNotificationSelected}
          onChange={handleCheckboxClick}
        />
        <Image
          src={notification?.icon_url ?? "/svg/account_circle.svg"}
          alt="notification-image"
          width={44}
          height={44}
        />
        <Link href={notification?.target_url} onClick={() => handleOnClickIndividualNotificationMarkAsRead(false)}>
          <div className="flex flex-col gap-1 text-start">
            <p className="leading-medium text-base font-semibold text-black">
              {notification?.title}
            </p>
            <p className="text-base font-normal leading-7 text-gray-500">
              {notification?.body}
            </p>
            <p className="text-sm font-normal leading-tight text-neutral-700">
              {timeDifference(notification?.created_at)} |{" "}
              {getTimeFromTimestamp(notification?.created_at)}
            </p>
          </div>
        </Link>
      </div>
      {!notification?.is_read && !isNotificationHovered && (
        <div className="h-3 w-3 rounded-full bg-orange-600" data-testid="notification-unread-indicator" />
      )}
      {isNotificationHovered && (
        <div className="flex gap-3">
          <DoneAllOutlined
            color="primary"
            onClick={() => handleOnClickIndividualNotificationMarkAsRead(true)}
            data-testid="individual-notification-mark-as-read-button"
          />
          <Delete
            color="error"
            onClick={handleOnClickIndividualNotificationDelete}
            data-testid="delete-individual-notification-button"
          />
        </div>
      )}
    </button>
  );
};

export default IndividualNotification;
