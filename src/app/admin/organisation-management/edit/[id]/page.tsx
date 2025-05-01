'use client'
import React, { useEffect, useState } from "react";
import { BreadcrumbComponent, CreateOrganisationComponent } from "@/components/common/DynamicImports";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useLazyGetOrganisationDetailsByIdQuery, useUpdateOrganisationMutation } from "@/redux/allReducer";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { CorporateFare } from "@mui/icons-material";
import { Box } from "@mui/material";
import { CreateOrganisationSuccessProps, EditOrganisationParamsProps, OrganisationFormSubmitProps } from "@/types/organisation";
import { useRouter } from "next/navigation";
import PageMetaData from "@/components/common/PageMetaData";

const EditOrganisation = ({ params }: EditOrganisationParamsProps) => {
  const [getOrganisationDetailsById] = useLazyGetOrganisationDetailsByIdQuery();
  const [updateOrganisation] = useUpdateOrganisationMutation();
  const [organisationDetails, setOrganisationDetails] = useState<OrganisationFormSubmitProps>();
  const organisationId = params?.id;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const handleGetOrganisationDetailsById = () => {
    getOrganisationDetailsById({
      endpoint: API_CONSTANTS.GET_ORGANISATION_LIST + organisationId + '/'
    }).unwrap().then((result) => {
      setOrganisationDetails(result as OrganisationFormSubmitProps);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  }

  useEffect(() => {
    handleGetOrganisationDetailsById();
  }, []);

  const handleEditOrganisation = (data: OrganisationFormSubmitProps) => {
    setIsFormSubmitted(true);
    updateOrganisation({
      endpoint: API_CONSTANTS.UPDATE_ORGANISATION + organisationId + '/',
      method: "PUT",
      data
    }).unwrap().then((result) => {
      const { message } = result as CreateOrganisationSuccessProps;
      dispatch(showToastMessage({ message, severity: 'success'}));
      router.push(URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW);
      setIsFormSubmitted(false);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: 'error'}))
      setIsFormSubmitted(false);
    })
  }

  return (
    <Box className="pt-5.5">
      <PageMetaData title="Edit Organization" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Organization List",
            path: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW,
            icon: (
              <CorporateFare className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Organization" },
        ]}
      />
      <CreateOrganisationComponent
        organisationDetails={organisationDetails}
        hanldeOrganisationSubmit={handleEditOrganisation}
        isFormSubmitted={isFormSubmitted}
      />
    </Box>
  )
};

export default EditOrganisation;