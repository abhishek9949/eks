"use client";
import React from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { ChannelMenuPropType } from "@/types/chatAdminTypes";
import { PERMISSIONS } from "@/constants/permissionsNames";
const ChannelMenu = ({
  openChannelMenu,
  handleCloseChannelActionMenu,
  row,
  handleDeleteChannel,
}: ChannelMenuPropType) => {
  return (
    <CommonActionMenu
      anchorEl={openChannelMenu}
      handleClose={handleCloseChannelActionMenu}
      actions={[
        {
          label: "Edit",
          link: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_EDIT_CHANNEL(row?.channel_id),
          permission: PERMISSIONS.CHAT_MANAGEMENT.EDIT_CHANNEL,
        },
        {
          label: "Delete",
          onClick: () => handleDeleteChannel(row?.channel_id),
          requiresConfirmation: true,
          confirmationTitle: "Are you sure you want to delete this channel?",
          confirmationDescription: `<b>Name:</b> ${row?.channel_name}`,
          permission: PERMISSIONS.CHAT_MANAGEMENT.DELETE_CHANNEL,
        },
      ]}
    />
  );
};

export default ChannelMenu;
