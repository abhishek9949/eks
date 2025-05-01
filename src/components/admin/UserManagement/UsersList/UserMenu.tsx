"use client";
import React from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { UserMenuType } from "@/types/userManagementType";
import { PERMISSIONS } from "@/constants/permissionsNames";

const UserMenu = ({
  openUserActionMenu,
  handleCloseUserActionMenu,
  row,
  handleUpdateUserStatus,
  handleResendUserInvitation,
}: UserMenuType) => {
  if (!row) return null;

  const { id, is_active, first_name, last_name, email, invite_status } = row;
  const actions = [
    {
      label: "Edit",
      permission: PERMISSIONS.USER_MANAGEMENT.EDIT,
      link: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_EDIT_USER(id),
    },
    {
      label: is_active ? "Deactivate" : "Reactivate",
      permission: PERMISSIONS.USER_MANAGEMENT.SUSPEND_ACTIVATE,
      onClick: () => handleUpdateUserStatus(id, is_active),
      requiresConfirmation: true,
      confirmationTitle: is_active
        ? "Are you sure you want to deactivate this user?"
        : "Are you sure you want to reactivate this user?",
      confirmationDescription: `Name: ${first_name} ${last_name} <br/> Email: ${email}`,
    },
  ];
  
  if (invite_status === "Expired" || invite_status === "Pending") {
    actions.push({
      label: "Reinvite",
      permission: PERMISSIONS.USER_MANAGEMENT.RESEND_INVITATION,
      onClick: () => handleResendUserInvitation(id),
      requiresConfirmation: true,
      confirmationTitle: "Are you sure you want to resend an invite to this user?",
      confirmationDescription: `Name: ${first_name} ${last_name} <br/> Email: ${email}`,
    });
  }
  
  if(row?.role_id === 4){
    actions.push({
      label: "Preview",
      permission: PERMISSIONS.USER_MANAGEMENT.MAIN,
      link: `${URL_CONSTANTS.ADMIN_USER_MANAGEMENT_PREVIEW_CONTENT_CREATOR(id)}`,
    });
  }

  return (
    <CommonActionMenu
      anchorEl={openUserActionMenu}
      handleClose={handleCloseUserActionMenu}
      actions={actions}
    />
  );
  
};

export default UserMenu;
