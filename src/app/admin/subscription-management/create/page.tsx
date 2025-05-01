'use client';
import React, { useState } from "react";
import { PaymentOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useCreateSubscriptionPlanMutation, useLazyGetOrganisationListQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import {
  SUBSCRIPTION_FORM_FIELDS,
  SubscriptionPlanSubmitProps
} from "@/types/subscription";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useRouter } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { BreadcrumbComponent, SubscriptionCreateComponent } from '@/components/common/DynamicImports';
import { InitialOrganisationList, OrganisationListProps } from "@/types/organisation";
import PageMetaData from "@/components/common/PageMetaData";

const CreateSubscriptionPlanHomePage = () => {
  const [createSubscriptionPlan] = useCreateSubscriptionPlanMutation();
  const [getOrganisationList] = useLazyGetOrganisationListQuery();
  const [organisationList, setOrganisationList] = useState<OrganisationListProps>(InitialOrganisationList);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleCreateSubscriptionPlan = (values: SubscriptionPlanSubmitProps) => {
    setIsFormSubmitted(true);
    createSubscriptionPlan({
      endpoint: API_CONSTANTS.CREATE_SUBSCRIPTION_PLAN,
      method: 'POST',
      data: {
        ...values,
        currency: "USD",
        max_users: values[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]
      }
    }).unwrap().then(() => {
      dispatch(showToastMessage({ message: "Subscription Plan created successfully", severity: "success" }));
      router.push(URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW);
      setIsFormSubmitted(false);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
      setIsFormSubmitted(false);
    })
  }

  const handleGetOrganisationList = () => {
    getOrganisationList({
      endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?pagination=false`,
    }).unwrap().then((result) => {
      setOrganisationList(result);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  }

  return (
    <Box className="pt-5.5">
     <PageMetaData title="Create Subscription" />

     <BreadcrumbComponent
        levels={[
          {
            name: "Subscription List",
            path: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW,
            icon: (
              <PaymentOutlined className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Subscription" },
        ]}
      />
      <SubscriptionCreateComponent
        handleSubscriptionPlanSubmit={handleCreateSubscriptionPlan}
        handleGetOrganisationList={handleGetOrganisationList}
        organisationList={organisationList}
        isFormSubmitted={isFormSubmitted}
      />
    </Box>
  )
};

export default CreateSubscriptionPlanHomePage;