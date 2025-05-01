import React, { useState } from "react";
import { MenuItem } from "@mui/material";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ModalDialog from "@/components/common/ModalDialog";
import StyledMenu from "@/components/common/StyledMenu";
import { truncateString } from "@/utils/reusableFunctions";
import { ReportedCommentsMenuProps } from "@/types/community/ReportedCommentsType";

const ReportedCommentsMenu = ({
  openReportCommentActionMenu,
  handleCloseReportCommentActionMenu,
  row,
  handleDeleteReportedComments,
  handleIgnoreReportedComments,
}: ReportedCommentsMenuProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openIgnoreDialog, setOpenIgnoreDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    handleCloseReportCommentActionMenu();
  };

  const handleConfirmDelete = () => {
    handleDeleteReportedComments([row?.comment_id ?? 0]);
    setOpenDeleteDialog(false);
    handleCloseReportCommentActionMenu();
  };

  const handleOpenIgnoreDialog = () => {
    setOpenIgnoreDialog(true);
  };

  const handleCloseIgnoreDialog = () => {
    setOpenIgnoreDialog(false);
    handleCloseReportCommentActionMenu();
  };

  const handleConfirmIgnore = () => {
    handleIgnoreReportedComments([row?.comment_id ?? 0]);
    setOpenIgnoreDialog(false);
    handleCloseReportCommentActionMenu();
  };

  return (
    <>
      <StyledMenu
        id="basic-reported-comment-menu"
        anchorEl={openReportCommentActionMenu}
        open={Boolean(openReportCommentActionMenu)}
        onClose={handleCloseReportCommentActionMenu}
        slotProps={{
          root: {
            "aria-labelledby": "report-action-long-button",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenDeleteDialog();
          }}
        >
          <DeleteOutlinedIcon /> Delete
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenIgnoreDialog();
          }}
        >
          <VisibilityOffOutlinedIcon /> Ignore
        </MenuItem>
      </StyledMenu>
      <ModalDialog
        dialogTitle={"Are you sure you want to delete this comment?"}
        dialogDescription={`<b>Comment:</b> ${truncateString(row?.content ?? "")} <br/> Reported by: ${row?.report_count_by_reason} People`}
        openDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDeleteDialog}
        handleConfirm={handleConfirmDelete}
      />

      <ModalDialog
        dialogTitle={"Are you sure you want to ignore this comment?"}
        dialogDescription={`<b>Comment:<b/> ${truncateString(row?.content ?? "")} <br/> Reported by: ${row?.report_count_by_reason} People`}
        openDialog={openIgnoreDialog}
        handleCloseDialog={handleCloseIgnoreDialog}
        handleConfirm={handleConfirmIgnore}
      />
    </>
  );
};

export default ReportedCommentsMenu;
