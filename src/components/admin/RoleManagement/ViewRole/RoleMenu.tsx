"use client";
import React from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { RoleMenuProps } from "@/types/roleAndPermission";
import { PERMISSIONS } from "@/constants/permissionsNames";
const RoleMenu = ({
  roleMoreActions,
  handleCloseRoleActionsMenu,
  row,
  handleDeleteRole,
}: RoleMenuProps) => {
  return (
    <CommonActionMenu
      anchorEl={roleMoreActions}
      handleClose={handleCloseRoleActionsMenu}
      actions={[
        {
          label: "Edit",
          permission: PERMISSIONS.ROLES_PERMISSIONS.EDIT,
          link: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_EDIT(row?.role_id as number),
        },
        {
          label: "Delete",
          permission: PERMISSIONS.ROLES_PERMISSIONS.DELETE,
          onClick: () => handleDeleteRole(row?.role_id as number),
          requiresConfirmation: true,
          confirmationTitle: "Delete Role",
          confirmationDescription: "Are you sure you want to delete this role?",
        },
      ]}
    />
  );
};


export default RoleMenu;
