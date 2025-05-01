"use client";

import React, { useState } from "react";
import { MenuItem, Box, Grid2 } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import StyledMenu from "@/components/common/StyledMenu";
import CreateBin from "@/components/BinComponents/CommonBinComponent/CreateBin/CreateBinForm";
import Image from "next/image";
import { SingleBinMenuPropType } from "@/types/bins/binsType";
import BlockIcon from "@mui/icons-material/Block";
import { binColors, DEFAULT_BIN_COLOR } from "@/constants/binColors";
import ModalDialog from "@/components/common/ModalDialog";
import ShareWithPeople from "@/components/common/ShareWithPeople/ShareWithPeople";
import { UserDataProps } from "@/types/shareWithPeople";
import { useGlobalUsersList } from "@/hooks/useGlobalUsersListV2";
import { useAppSelector } from "@/redux/hooks";

const SingleBinMenu = ({
  openBinActionMenu,
  handleCloseBinActionMenu,
  singleBinData,
  handleUpdateBin,
  handleDeleteBin,
  handleShareBin,
}: SingleBinMenuPropType) => {
  const { globalUsersList } = useGlobalUsersList();
  const [openCreateBinDialog, setOpenCreateBinDialog] = useState(false);
  const [openColorMenu, setOpenColorMenu] = useState(false);
  const [colorAnchorEl, setColorAnchorEl] = useState<null | HTMLElement>(null);
  const [openDeleteBinDialog, setOpenDeleteBinDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState<
    UserDataProps[] | []
  >([]);
  const loggedInUser = useAppSelector(
    (state) => state.cookies.cookies.userCookies,
  );

  const checkSharedBin =
    loggedInUser?.user_id === singleBinData?.created_by?.user_id;

  const handleChangeSelectUser = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: UserDataProps[],
  ) => {
    setSelectedUsers(newValue);
  };

  const handleClickOpenShareDialog = () => {
    setOpenShareDialog(true);
  };
  const handleCloseShareDiaog = () => {
    setOpenShareDialog(false);
    handleCloseBinActionMenu();
  };

  const handleShare = () => {
    const selectedUserIds = selectedUsers?.map((item) => item.id);
    if (handleShareBin) {
      handleShareBin(singleBinData?.bin_id, selectedUserIds);
    }
    handleCloseShareDiaog();
    handleCloseBinActionMenu();
  };

  // Delete bin

  const handleOpenDeleteBinDialog = () => {
    setOpenDeleteBinDialog(true);
  };

  const handleCloseDeleteBinDialog = () => {
    setOpenDeleteBinDialog(false);
    handleCloseBinActionMenu();
  };

  const handleConfirmDeleteBin = () => {
    if (handleDeleteBin) {
      handleDeleteBin(singleBinData?.bin_id ?? singleBinData?.bin);
      handleCloseBinActionMenu();
    }
    handleCloseDeleteBinDialog();
  };

  // Rename Bin

  const handleOpenCreateBinDialog = () => {
    setOpenCreateBinDialog(true);
  };

  const handleCloseCreateBin = () => {
    setOpenCreateBinDialog(false);
    handleCloseBinActionMenu();
  };

  // Bin Color Chnage

  const handleChangeBinColor = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(event.currentTarget);
    setOpenColorMenu(true);
  };

  const handleCloseColorMenu = () => {
    setOpenColorMenu(false);
    handleCloseBinActionMenu();
  };

  const handleColorSelection = (color: string) => {
    const payload = {
      bin_name: singleBinData?.bin_name,
      bin_color: color,
    };
    if (handleUpdateBin) {
      handleUpdateBin(singleBinData?.bin_id, payload);
      handleCloseBinActionMenu();
    }
    handleCloseColorMenu();
  };

  return (
    <>
      <StyledMenu
        id="basic-bin-menu"
        anchorEl={openBinActionMenu}
        open={Boolean(openBinActionMenu)}
        onClose={handleCloseBinActionMenu}
        slotProps={{
          root: {
            "aria-labelledby": "bin-action-long-button",
          },
        }}
        disableScrollLock={true}
      >
        {checkSharedBin && (
          <MenuItem disableRipple onClick={handleClickOpenShareDialog}>
            <ShareOutlinedIcon /> Share
          </MenuItem>
        )}
        {checkSharedBin && (
          <MenuItem disableRipple onClick={handleChangeBinColor}>
            <CircleIcon
              sx={{ color: `${singleBinData?.bin_color} !important` }}
            />{" "}
            Color
          </MenuItem>
        )}

        {checkSharedBin && (
          <MenuItem disableRipple onClick={handleOpenCreateBinDialog}>
            <Image
              width={20}
              height={20}
              alt="Bin"
              src="/svg/folder_edit.svg"
              className="mr-[12px]"
            />
            Rename
          </MenuItem>
        )}

        <MenuItem disableRipple onClick={handleOpenDeleteBinDialog}>
          <DeleteOutlineOutlinedIcon /> {checkSharedBin ? "Delete" : "Remove"}
        </MenuItem>
      </StyledMenu>

      {/* Color Menu */}
      <StyledMenu
        id="bin-color-menu"
        anchorEl={colorAnchorEl}
        open={openColorMenu}
        onClose={handleCloseColorMenu}
      >
        <Grid2 container spacing={2} className="!w-[250px] p-2">
          <Grid2>
            <BlockIcon
              onClick={() => handleColorSelection(DEFAULT_BIN_COLOR)}
              sx={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                border:
                  singleBinData?.bin_color === DEFAULT_BIN_COLOR
                    ? "2px solid #000"
                    : "none",
              }}
            />
          </Grid2>
          {binColors.map((color) => (
            <Grid2 key={color}>
              <Box
                sx={{
                  bgcolor: color,
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  border:
                    singleBinData?.bin_color === color
                      ? "2px solid #000"
                      : "none",
                  cursor: "pointer",
                }}
                onClick={() => handleColorSelection(color)}
              />
            </Grid2>
          ))}
        </Grid2>
      </StyledMenu>

      {/* Create or Update Bin Dialog */}
      <CreateBin
        openCreateBinDialog={openCreateBinDialog}
        handleCloseCreateBin={handleCloseCreateBin}
        binId={singleBinData?.bin_id}
        handleUpdateBin={handleUpdateBin}
      />

      <ModalDialog
        dialogTitle={`Are you sure you want to ${checkSharedBin ? "delete" : "remove"} this bin?`}
        dialogDescription={`<b>Bin Name:</b> "${singleBinData?.bin_name}"`}
        openDialog={openDeleteBinDialog}
        handleCloseDialog={handleCloseDeleteBinDialog}
        handleConfirm={handleConfirmDeleteBin}
        actionButtonClass="!m-auto"
        cancelBtnLabel="Cancel"
        submitBtnLabel={checkSharedBin ? "Delete" : "Remove"}
        buttonSize="large"
      />

      <ShareWithPeople
        usersData={globalUsersList}
        open={openShareDialog}
        handleClose={handleCloseShareDiaog}
        handleChangeSelectUser={handleChangeSelectUser}
        handleShare={handleShare}
      />
    </>
  );
};

export default SingleBinMenu;
