import React from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { GroupMoreActionsProps } from "@/types/chats";

const GroupMoreActions = ({
  openGroupMoreActions,
  handleCloseGroupMoreActions,
  handleClearGroupChat,
  currentRow,
  userId,
  handleDeleteGroup,
}: GroupMoreActionsProps) => {
  const isGroupAdmin = userId === currentRow?.created_by?.user_id;
  const actions = [
    isGroupAdmin
      ? {
          label: "Delete Group",
          onClick: () =>
            handleDeleteGroup && handleDeleteGroup(currentRow?.group_id),
          requiresConfirmation: true,
          confirmationTitle: "Delete Group",
          confirmationDescription:
            "Are you sure you want to delete this group?",
        }
      : null,
    {
      label: "Clear Chat",
      onClick: () =>
        handleClearGroupChat && handleClearGroupChat(currentRow?.group_id),
      requiresConfirmation: true,
      confirmationTitle: "Clear Chat",
      confirmationDescription: "Are you sure you want to clear the chat?",
    },
  ].filter((action) => action !== null);

  return (
    <CommonActionMenu
      anchorEl={openGroupMoreActions}
      handleClose={handleCloseGroupMoreActions}
      actions={actions}
      menuDirection="ltr"
    />
  );
};

export default GroupMoreActions;
