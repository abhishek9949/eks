'use client';
import React, { useEffect, useState } from "react";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { Diversity2 } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useEditSubscriptionPlanMutation, useLazyGetOrganisationListQuery, useLazyGetSubscriptionPlanByIdQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { EditSubscriptionParamsProps, IndividualSubscriptionProps, SUBSCRIPTION_FORM_FIELDS, SubscriptionPlanSubmitProps } from "@/types/subscription";
import { useDispatch } from "react-redux";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useRouter } from "next/navigation";
import { BreadcrumbComponent, SubscriptionCreateComponent } from "@/components/common/DynamicImports";
import { InitialOrganisationList, OrganisationListProps } from "@/types/organisation";
import PageMetaData from "@/components/common/PageMetaData";

const EditSubscriptionPlan = ({ params }: EditSubscriptionParamsProps) => {
  const [organisationList, setOrganisationList] = useState<OrganisationListProps>(InitialOrganisationList);
  const [subscriptionDetails, setSubscriptionDetails] = useState<IndividualSubscriptionProps>();
  const [getOrganisationList] = useLazyGetOrganisationListQuery();
  const [getSubscriptionPlanById] = useLazyGetSubscriptionPlanByIdQuery();
  const [editSubscriptionPlan] = useEditSubscriptionPlanMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const planId = params.id;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleGetOrganisationList = () => {
    getOrganisationList({
      endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?pagination=false`,
    }).unwrap().then((result) => {
      setOrganisationList(result);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  }

  const handleGetSubscriptionPlanById = () => {
    getSubscriptionPlanById({
      endpoint: API_CONSTANTS.GET_SUBSCRIPTION_PLAN_LIST + planId
    }).unwrap().then((result) => {
      setSubscriptionDetails(result as IndividualSubscriptionProps);
    })
  }

  useEffect(() => {
    handleGetSubscriptionPlanById();
  }, []);

  const handleEditSubscriptionPlan = (values: SubscriptionPlanSubmitProps) => {
    setIsFormSubmitted(true);
    editSubscriptionPlan({
      endpoint: API_CONSTANTS.SUBSCRIPTION_PLAN + planId,
      method: 'PUT',
      data: {
        ...values,
        currency: "USD",
        max_users: values[SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]
      }
    }).unwrap().then(() => {
      dispatch(showToastMessage({ message: "Subscription Plan edited successfully", severity: "success" }));
      router.push(URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW);
      setIsFormSubmitted(false);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
      setIsFormSubmitted(false);
    })
  }

  return (
    <Box className="pt-5.5">
     <PageMetaData title="Edit Subscription Plan" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Subscription List",
            path: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW,
            icon: (
              <Diversity2 className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Subscription Plan" },
        ]}
      />
      <SubscriptionCreateComponent
        handleGetOrganisationList={handleGetOrganisationList}
        organisationList={organisationList}
        subscriptionDetails={subscriptionDetails}
        handleSubscriptionPlanSubmit={handleEditSubscriptionPlan}
        isFormSubmitted={isFormSubmitted}
      />
    </Box>
  )
};

export default EditSubscriptionPlan;