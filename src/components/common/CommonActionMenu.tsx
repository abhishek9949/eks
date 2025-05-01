"use client";
import React, { useState } from "react";
import { MenuItem, ListItemIcon } from "@mui/material";
import StyledMenu from "@/components/common/StyledMenu";
import ModalDialog from "@/components/common/ModalDialog";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";
import {
  EditOutlined,
  Publish,
  ToggleOffOutlined,
  Visibility,
  DeleteOutlineOutlined,
  BlockOutlined,
} from "@mui/icons-material";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import Image from "next/image";

const iconMapping: { [key: string]: JSX.Element } = {
  Preview: <Visibility />,
  Edit: <EditOutlined />,
  Rename: <EditOutlined />,
  Delete: <DeleteOutlineOutlined />,
  Publish: <Publish />,
  Deactivate: <ToggleOffOutlined />,
  Reactivate: <ToggleOffOutlined />,
  Reinvite: <ForwardToInboxOutlinedIcon />,
  Block: <BlockOutlined />,
  "Clear Chat": <Image src={"/svg/clearChat.svg"} width={18} height={14} alt="Clear chat" />
};

interface Action {
  label: string;
  permission?: string;
  onClick?: () => void;
  link?: string;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
}

interface CommonActionMenuProps {
  anchorEl: HTMLElement | null;
  handleClose: () => void;
  actions: Action[];
  menuDirection?: string;
}

const CommonActionMenu: React.FC<CommonActionMenuProps> = ({
  anchorEl,
  handleClose,
  actions,
  menuDirection = "rtl",
}) => {
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  const isLTR = menuDirection === "ltr";

  // State to handle confirmation modal
  const [openModal, setOpenModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    confirmAction: () => void;
  } | null>(null);

  const handleOpenModal = (action: Action) => {
    if (action.requiresConfirmation && action.onClick) {
      setModalConfig({
        title:
          action.confirmationTitle ??
          `Are you sure you want to ${action.label.toLowerCase()}?`,
        description:
          action.confirmationDescription ?? "This action cannot be undone.",
        confirmAction: action.onClick,
      });
      setOpenModal(true);
    } else if (action.onClick) {
      action.onClick();
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalConfig(null);
    handleClose();
  };

  const sharedIconMapping: { [key: string]: string } = {
    "Delete Group": "Delete",
    Remove: "Delete",
  };

  return (
    <>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isLTR ? "left" : "right", // Change based on prop
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isLTR ? "left" : "right",
        }}
      >
        {actions.map((action: Action) => {
          const { permission, label, link } = action;
          const mappedLabel = sharedIconMapping[label] || label;
          if (!permission || checkPermissionExists(permission, permissions)) {
            return (
              <MenuItem
                key={label}
                onClick={() =>
                  !link ? handleOpenModal(action) : handleClose()
                }
                component={link ? "a" : "li"}
                {...(link && { href: link })} // Ensures it works as an anchor link
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {link ? (
                  <Link
                    href={link}
                    passHref
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <ListItemIcon>{iconMapping[mappedLabel]}</ListItemIcon>
                    {label}
                  </Link>
                ) : (
                  <>
                    <ListItemIcon>{iconMapping[mappedLabel]}</ListItemIcon>
                    {label}
                  </>
                )}
              </MenuItem>
            );
          }
          return null;
        })}
      </StyledMenu>

      {modalConfig && (
        <ModalDialog
          dialogTitle={modalConfig.title}
          dialogDescription={modalConfig.description}
          openDialog={openModal}
          handleCloseDialog={handleCloseModal}
          handleConfirm={() => {
            modalConfig.confirmAction();
            handleCloseModal();
          }}
        />
      )}
    </>
  );
};

export default CommonActionMenu;
