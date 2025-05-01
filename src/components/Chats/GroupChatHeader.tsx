import React, { useState } from "react";
import {
  DeleteOutline,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
  ManageAccountsOutlined,
} from "@mui/icons-material";
import { IconButton, MenuItem } from "@mui/material";
import clsx from "clsx";
import StyledMenu from "@/components/common/StyledMenu";
import { GroupChatHeaderProps } from "@/types/chats";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ModalDialog from "../common/ModalDialog";
import ChatIconComponent from "./ChatIconComponent";

const GroupChatHeader = ({
  groupDetails,
  handleDeleteGroup,
  handleLeaveGroup,
  userId,
}: GroupChatHeaderProps) => {
  const [groupChatMoreActions, setGroupChatMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const isGroupAdmin = userId === Number(groupDetails?.created_by);

  const [isLeaveGroupPopupOpen, setIsLeaveGroupPopupOpen] = useState(false);
  const [isDeleteGroupPopupOpen, setIsDeleteGroupPopupOpen] = useState(false);

  const handleCloseGroupChatMoreActions = () => {
    setGroupChatMoreActions(null);
  };

  const toggleLeaveGroupPopup = () => {
    handleCloseGroupChatMoreActions();
    setIsLeaveGroupPopupOpen(!isLeaveGroupPopupOpen);
  };

  const toggleDeleteGroupPopup = () => {
    handleCloseGroupChatMoreActions();
    setIsDeleteGroupPopupOpen(!isDeleteGroupPopupOpen);
  };

  const handleConfirmDeleteGroup = () => {
    handleDeleteGroup(groupDetails?.group_id);
    toggleDeleteGroupPopup();
  };

  const handleConfirmLeaveGroup = () => {
    handleLeaveGroup(groupDetails?.group_id);
    toggleLeaveGroupPopup();
  };

  return (
    <>
      <div className="flex items-center">
       <ChatIconComponent
        type="group"
        width={54}
       />
        <div
          className={clsx(
            "relative flex flex-col px-4 pb-2",
            groupChatMoreActions && "bg-zinc-100",
          )}
        >
          <div className="flex items-center gap-2">
            <p className="text-lg font-medium leading-snug text-neutral-900 ">
              {groupDetails?.group_name}
            </p>
            <IconButton
              id="group-chat-more-actions"
              aria-controls={groupChatMoreActions ? "basic-menu" : undefined}
              aria-expanded={groupChatMoreActions ? "true" : undefined}
              aria-haspopup="true"
              onClick={(event) => setGroupChatMoreActions(event?.currentTarget)}
              data-testid="group-chat-more-actions"
            >
              <KeyboardArrowDownOutlined />
            </IconButton>
            <StyledMenu
              id="basic-menu"
              anchorEl={groupChatMoreActions}
              open={Boolean(groupChatMoreActions)}
              onClose={handleCloseGroupChatMoreActions}
              slotProps={{
                root: {
                  "aria-labelledby": "group-chat-more-actions",
                },
              }}
              sx={{
                "& .MuiPaper-root": {
                  top: "125px !important", // Adjust the top position
                  boxShadow: "0px 0px 4px 4px rgba(0, 0, 0, 0.1)", // Custom div shadow
                },
              }}
            >
              <MenuItem onClick={handleCloseGroupChatMoreActions}>
                <ManageAccountsOutlined />
                <Link
                  href={`${URL_CONSTANTS?.MANAGE_MEMBERS}?title=${groupDetails?.group_name}&id=${groupDetails?.group_id}&messageType=group&createdBy=${groupDetails?.created_by}`}
                  className="text-xs font-normal text-neutral-700"
                >
                  Manage Members
                </Link>
              </MenuItem>
              {!isGroupAdmin && (
                <MenuItem onClick={toggleLeaveGroupPopup}>
                  <LogoutOutlined />
                  <span className="text-xs font-normal text-neutral-700">
                    Leave
                  </span>
                </MenuItem>
              )}
              {isGroupAdmin && (
                <MenuItem onClick={toggleDeleteGroupPopup}>
                  <DeleteOutline />
                  <span className="text-xs font-normal text-neutral-700">
                    Delete
                  </span>
                </MenuItem>
              )}
            </StyledMenu>
          </div>
          <div className="flex items-center gap-2 text-sm font-normal leading-none text-stone-500">
            <span>{groupDetails?.members} Members</span>
            <div className="h-1 w-1 rounded-full bg-stone-500" />
            <span>{groupDetails?.is_public ? "Public" : "Private"}</span>
          </div>
        </div>
      </div>
      <ModalDialog
        dialogTitle="Leave Group"
        dialogDescription="Are you sure you want to leave this group?"
        openDialog={isLeaveGroupPopupOpen}
        handleCloseDialog={toggleLeaveGroupPopup}
        handleConfirm={handleConfirmLeaveGroup}
      />
      <ModalDialog
        dialogTitle="Delete Group"
        dialogDescription="Are you sure you want to delete this group?"
        openDialog={isDeleteGroupPopupOpen}
        handleCloseDialog={toggleDeleteGroupPopup}
        handleConfirm={handleConfirmDeleteGroup}
      />
    </>
  );
};

export default GroupChatHeader;
