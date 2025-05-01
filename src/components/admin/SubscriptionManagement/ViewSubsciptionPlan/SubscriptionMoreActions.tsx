"use client";
import React from "react";
import CommonActionMenu from "@/components/common/CommonActionMenu";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { SubscriptionMoreActionsProps } from "@/types/subscription";
import { PERMISSIONS } from "@/constants/permissionsNames";

const SubscriptionMoreActions = ({
  openMoreActions,
  handleCloseMoreActions,
  row,
  handleDeleteSubscriptionPlan,
  handleChangeSubscriptionPlanStatus,
  handlePublishSubscriptionPlan,
}: SubscriptionMoreActionsProps) => {
  return (
    <CommonActionMenu
      anchorEl={openMoreActions}
      handleClose={handleCloseMoreActions}
      actions={[
        {
          label: "Edit",
          permission: PERMISSIONS.SUBSCRIPTION_PLANS.EDIT,
          link: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_EDIT(row?.plan_id as number),
        },
        {
          label: "Delete",
          permission: PERMISSIONS.SUBSCRIPTION_PLANS.DELETE,
          onClick: () => handleDeleteSubscriptionPlan(row?.plan_id as number),
          requiresConfirmation: true,
          confirmationTitle: "Delete Subscription Plan",
          confirmationDescription:
            "Are you sure you want to delete this subscription plan?",
        },
        row?.is_published
          ? {
              label: row?.is_active ? "Deactivate" : "Reactivate",
              permission: PERMISSIONS.SUBSCRIPTION_PLANS.SUSPEND_ACTIVATE,
              onClick: () =>
                handleChangeSubscriptionPlanStatus(
                  row?.plan_id,
                  !row?.is_active,
                ),
              requiresConfirmation: true,
              confirmationTitle: `${row?.is_active ? "Deactivate" : "Reactivate"} Subscription Plan`,
              confirmationDescription: `Are you sure you want to ${row?.is_active ? "deactivate" : "reactivate"} this subscription plan?`,
            }
          : {
              label: "Publish",
              permission: PERMISSIONS.SUBSCRIPTION_PLANS.PUBLISH_SUBSCRIPTIONS,
              onClick: () =>
                handlePublishSubscriptionPlan(row?.plan_id as number),
              requiresConfirmation: true,
              confirmationTitle: "Publish Subscription Plan",
              confirmationDescription:
                "Are you sure you want to publish this subscription plan?",
            },
      ].filter(Boolean)}
    />
  );
};

export default SubscriptionMoreActions;
