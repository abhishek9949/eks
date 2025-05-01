'use client'
import React, { useState } from "react";
import { BreadcrumbComponent, CreateOrganisationComponent } from "@/components/common/DynamicImports";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useCreateOrganisationMutation } from "@/redux/allReducer";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { CreateOrganisationSuccessProps, OrganisationFormSubmitProps } from "@/types/organisation";
import { CorporateFare } from "@mui/icons-material";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import PageMetaData from "@/components/common/PageMetaData";

const CreateOrganisationHomePage = () => {
  const [createOrganisation] = useCreateOrganisationMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const handleCreateOrganisation = (data: OrganisationFormSubmitProps) => {
    setIsFormSubmitted(true);
    createOrganisation({
      endpoint: API_CONSTANTS.CREATE_ORGANISATION,
      method: 'POST',
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
  };

  return (
    <Box className="pt-5.5">
      <PageMetaData title="Create Organization" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Organization List",
            path: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW,
            icon: (
              <CorporateFare className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Organization" },
        ]}
      />
      <CreateOrganisationComponent
        hanldeOrganisationSubmit={handleCreateOrganisation}
        isFormSubmitted={isFormSubmitted}
      />
    </Box>
  )
}

export default CreateOrganisationHomePage;