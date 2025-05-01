"use client";
import React from "react";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { ContentMoreActionProps } from "@/types/content";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ContentMoreActions = ({
  openMoreActions,
  handleCloseMoreActions,
  row,
  handleUpdateContentStatus,
  handleDeleteContent,
}: ContentMoreActionProps) => {
  const isMenuItemDisabled =
    row?.publish_status === "pending" || row?.publish_status === "failure";

  // Define actions dynamically
  const actions = [
    {
      label: "Preview",
      permission: PERMISSIONS.CONTENT_MANAGEMENT.LIST,
      link: URL_CONSTANTS.ADMIN_CONTENT_PRIVIEW(row?._id as string),
      disabled: isMenuItemDisabled,
    },
    {
      label: "Edit",
      permission: PERMISSIONS.CONTENT_MANAGEMENT.EDIT,
      link: URL_CONSTANTS.ADMIN_CONTENT_EDIT(row?._id as string),
      disabled: isMenuItemDisabled,
    },
    {
      label: "Delete",
      permission: PERMISSIONS.CONTENT_MANAGEMENT.DELETE,
      onClick: () => handleDeleteContent(row?._id as string),
      requiresConfirmation: true,
      confirmationTitle: "Delete Content",
      confirmationDescription: "Are you sure you want to delete this content?",
      disabled: isMenuItemDisabled,
    },
    row?.publish_status === "draft"
      ? {
          label: "Publish",
          permission: PERMISSIONS.CONTENT_MANAGEMENT.PUBLISH_CONTENT,
          onClick: () => handleUpdateContentStatus(row?._id, "published"),
          requiresConfirmation: true,
          confirmationTitle: "Publish Content",
          confirmationDescription:
            "Are you sure you want to publish this content?",
        }
      : null,
    row?.publish_status === "published"
      ? {
          label: "Deactivate",
          permission: PERMISSIONS.CONTENT_MANAGEMENT.SUSPEND_ACTIVATE_CONTENT,
          onClick: () =>
            handleUpdateContentStatus(row?._id, "inactive"),
          requiresConfirmation: true,
          confirmationTitle: "Deactivate Content",
          confirmationDescription:
            "Are you sure you want to deactivate this content?",
        }
      : null,
  ].filter((action) => action !== null); // Ensure no `null` or `false` values are included

  return (
    <CommonActionMenu
      anchorEl={openMoreActions}
      handleClose={handleCloseMoreActions}
      actions={actions}
    />
  );
};

export default ContentMoreActions;
