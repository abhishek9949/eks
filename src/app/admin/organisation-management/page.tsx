import React from "react";
import CreateOrganizationWizard from "@/components/admin/OrganisationManagement/CreateOrganisation/CreateOrganizationWizard";
import { Metadata } from "next";
import { Box } from "@mui/material";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { CorporateFare } from "@mui/icons-material";


export const metadata: Metadata = {
  title: 'Create Organization',
};

export default function Home() {
  return (
    <Box className="pt-5.5">
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
        <CreateOrganizationWizard />
      </Box>
  )

}
