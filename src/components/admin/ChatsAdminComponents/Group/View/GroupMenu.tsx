"use client";
import React, { useState } from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { GroupMenuPropType } from "@/types/chatAdminTypes";
import RenameGroup from "./RenameGroup/RenameGroup";
// NOSONAR
// import { PERMISSIONS } from "@/constants/permissionsNames";
const GroupMenu = ({
  openGroupMenu,
  handleCloseGroupActionMenu,
  row,
  handleDeleteGroup,
  handleUpdateGroupDetails,
}: GroupMenuPropType) => {
  const [openRenameGroupDialog, setOpenRenameGroupDialog] = useState(false);
  const handleOpenRenameGroup = () => {
    setOpenRenameGroupDialog(true);
  };

  const handleCloseRenameGroup = () => {
    setOpenRenameGroupDialog(false);
    handleCloseGroupActionMenu();
  };

  return (
    <>
      <CommonActionMenu
        anchorEl={openGroupMenu}
        handleClose={handleCloseGroupActionMenu}
        actions={[
          {
            label: "Rename",
            onClick: () => {
              handleOpenRenameGroup();
            },
            //NOSONAR
            // permission: PERMISSIONS.CHAT_MANAGEMENT.EDIT_GROUP,
          },
          {
            label: "Delete",
            onClick: () => handleDeleteGroup(row?.group_id),
            requiresConfirmation: true,
            confirmationTitle: "Are you sure you want to delete this group?",
            confirmationDescription: `<b>Name:</b> ${row?.group_name}`,
            //NOSONAR
            // permission: PERMISSIONS.CHAT_MANAGEMENT.DELETE_GROUP,
          },
        ]}
      />
      <RenameGroup
        openRenameGroupDialog={openRenameGroupDialog}
        handleCloseRenameGroup={handleCloseRenameGroup}
        groupId={row?.group_id}
        handleUpdateGroup={handleUpdateGroupDetails}
      />
    </>
  );
};

export default GroupMenu;
