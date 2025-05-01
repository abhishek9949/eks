"use client";
import React from "react";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { OrganisationMoreActionsProps } from "@/types/organisation";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { PERMISSIONS } from "@/constants/permissionsNames";

const OrganisationMoreActions = ({
  openMoreActions,
  handleCloseMoreActions,
  row,
  handleUpdateOrganisationStatus,
  handleDeleteOrganisation,
}: OrganisationMoreActionsProps) => {

  // Define actions dynamically
  const actions = [
    {
      label: "Edit",
      link: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_EDIT(row?.organisation_id as number),
      permission: PERMISSIONS.ORGANIZATIONS.EDIT,
    },
    {
      label: "Delete",
      onClick: () => handleDeleteOrganisation(row?.organisation_id as number),
      requiresConfirmation: true,
      confirmationTitle: "Delete Organization",
      confirmationDescription: "Are you sure you want to delete this Organization?",
      permission: PERMISSIONS.ORGANIZATIONS.REMOVE,
    },
   {
      label: row?.is_active ? "Deactivate" : "Reactivate",
      onClick: () => handleUpdateOrganisationStatus(row?.organisation_id as number, !row?.is_active),
      requiresConfirmation: true,
      confirmationTitle: `${row?.is_active ? "Deactivate" : "Reactivate"} Organization`,
      confirmationDescription: `Are you sure you want to ${row?.is_active ? "deactivate" : "reactivate"} this Organization?`,
      permission: PERMISSIONS.ORGANIZATIONS.SUSPEND_ACTIVATE,
    },
  ].filter(Boolean); // Remove undefined actions

  return (
    <CommonActionMenu
      anchorEl={openMoreActions}
      handleClose={handleCloseMoreActions}
      actions={actions}
    />
  );
};

export default OrganisationMoreActions;
