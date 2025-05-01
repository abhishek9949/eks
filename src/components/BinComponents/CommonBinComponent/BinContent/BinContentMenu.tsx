"use client";

import React, { useState } from "react";
import { MenuItem } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import StyledMenu from "@/components/common/StyledMenu";
import ModalDialog from "@/components/common/ModalDialog";
import { BinContentMenuPropType } from "@/types/bins/binsType";

const BinContentMenu = ({
  openBinContentAction,
  handleCloseBinContentAction,
  id,
  title,
  handleRemoveBinContent,
}: BinContentMenuPropType) => {
  const [openDeleteBinDialog, setOpenDeleteBinDialog] = useState(false);

  const handleOpenDeleteBinDialog = () => {
    setOpenDeleteBinDialog(true);
  };

  const handleCloseDeleteBinDialog = () => {
    setOpenDeleteBinDialog(false);
    handleCloseBinContentAction();
  };

  const handleConfirmDeleteBin = () => {
    if (handleRemoveBinContent) {
      handleRemoveBinContent(id);
      handleCloseBinContentAction();
    }
    handleCloseDeleteBinDialog();
  };

  return (
    <>
      <StyledMenu
        id="basic-bin-content-menu"
        anchorEl={openBinContentAction}
        open={Boolean(openBinContentAction)}
        onClose={handleCloseBinContentAction}
        slotProps={{
          root: {
            "aria-labelledby": "bin-content-action-long-button",
          },
        }}
        disableScrollLock={true}
      >
        <MenuItem disableRipple onClick={handleOpenDeleteBinDialog}>
          <DeleteOutlineOutlinedIcon /> Remove
        </MenuItem>
      </StyledMenu>

      <ModalDialog
        dialogTitle={
          "Are you sure you want to remove the content from this bin ?"
        }
        dialogDescription={`<b>Content Name:</b> "${title}"`}
        openDialog={openDeleteBinDialog}
        handleCloseDialog={handleCloseDeleteBinDialog}
        handleConfirm={handleConfirmDeleteBin}
        actionButtonClass="!m-auto"
        cancelBtnLabel="Cancel"
        submitBtnLabel="Remove"
        buttonSize="large"
      />
    </>
  );
};

export default BinContentMenu;
