import React from "react";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { GetSingleForumResult } from "@/types/community";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { PERMISSIONS } from "@/constants/permissionsNames";

type ActionCommunityProps = {
  openUserActionMenu: HTMLElement | null;
  handleCloseUserActionMenu: () => void;
  row: GetSingleForumResult;
  handleActivateDeactivateFourm: (forum_id: number, status: string) => void;
};

const ActionCommunity: React.FC<ActionCommunityProps> = ({
  openUserActionMenu,
  handleCloseUserActionMenu,
  row,
  handleActivateDeactivateFourm,
}) => {
  // Define actions
  const actions = [
    {
      label: "Edit",
      permission: PERMISSIONS.COMMUNITY_MANAGEMENT.EDIT,
      link : URL_CONSTANTS.ADMIN_COMMUNITY_EDIT(row?.forum_id)
    },
    {
      label: row && (row?.status === "active" ? "Deactivate" : "Reactivate"),
      permission: PERMISSIONS.COMMUNITY_MANAGEMENT.DELETE,
      onClick: () =>
        handleActivateDeactivateFourm(
          row?.forum_id,
          row?.status === "active" ? "inactive" : "active",
        ),
      requiresConfirmation: true,
      confirmationTitle:
        row?.status === "active"
          ? "Are you sure you want to deactivate this community?"
          : "Are you sure you want to reactivate this community?",
      confirmationDescription: `<b>Title:</b> "${row?.topic_title}"`,
    },
  ].filter(Boolean); // Remove undefined items

  return (
    <CommonActionMenu
      anchorEl={openUserActionMenu}
      handleClose={handleCloseUserActionMenu}
      actions={actions}
    />
  );
};

export default ActionCommunity;
