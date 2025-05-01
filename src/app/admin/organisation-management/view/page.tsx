"use client";
import React, { useEffect, useState } from "react";
import {
  BreadcrumbComponent,
  ViewOrganisationComponent,
} from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { Add, CorporateFare } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import {
  CreateOrganisationSuccessProps,
  InitialOrganisationList,
  OrganisationListProps,
} from "@/types/organisation";
import {
  useLazyGetOrganisationListQuery,
  useUpdateOrganisationMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import Link from "next/link";
import PageMetaData from "@/components/common/PageMetaData";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ViewOrganisationHomePage = () => {
  const [organisationList, setOrganisationList] =
    useState<OrganisationListProps>(InitialOrganisationList);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [callApi, setCallApi] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [getOrganisationList] = useLazyGetOrganisationListQuery();
  const [updateOrganisation] = useUpdateOrganisationMutation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector(
    (state) => state.filterSlice?.organisationFilters,
  );
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const handleGetOrganisationList = (setPageNumber: boolean) => {
    const {
      searchText,
      organisationName,
      organisationType,
      createdAt,
      isActive,
      sortColumn,
      sortDirection,
    } = filters;
    let pageNumber = page;
    if (setPageNumber) {
      pageNumber = 1;
      setCallApi(false);
      setPage(1);
    }
    setIsLoading(true);
    getOrganisationList({
      endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?page=${pageNumber}&page_size=${rowsPerPage}&query_text=${searchText}&organisation_name=${organisationName}&organisation_type=${organisationType}&created_at=${createdAt}&is_active=${isActive}&sort_by=${sortColumn}&order=${sortDirection}`,
    })
      .unwrap()
      .then((result) => {
        setOrganisationList(result);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      })
      .finally(() => {
        setCallApi(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleGetOrganisationList(true);
  }, [filters]);

  useEffect(() => {
    if (callApi) {
      handleGetOrganisationList(false);
    }
  }, [page, rowsPerPage]);

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleUpdateOrganisationStatus = (
    organisationId: number,
    isActive: boolean,
  ) => {
    updateOrganisation({
      endpoint: API_CONSTANTS.UPDATE_ORGANISATION + organisationId + "/status/",
      method: "PATCH",
      data: {
        is_active: isActive,
      },
    })
      .unwrap()
      .then((result) => {
        const { message } = result as CreateOrganisationSuccessProps;
        dispatch(showToastMessage({ message, severity: "success" }));
        handleGetOrganisationList(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  const handleDeleteOrganisation = (organisationId: number) => {
    updateOrganisation({
      endpoint: API_CONSTANTS.UPDATE_ORGANISATION + organisationId + "/",
      method: "DELETE",
    })
      .unwrap()
      .then((result) => {
        const { message } = result as CreateOrganisationSuccessProps;
        dispatch(showToastMessage({ message, severity: "success" }));
        handleGetOrganisationList(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  return (
    <Box className="relative pt-5.5">
      <PageMetaData title="Organization List" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Organizations",
            path: URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_VIEW,
            icon: (
              <CorporateFare className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Organization List" },
        ]}
      />
      {checkPermissionExists(PERMISSIONS.ORGANIZATIONS.CREATE, permissions) && (
        <Box className="absolute end-1 top-3.5 z-1">
          <Link href={URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_CREATE}>
            <Button
              variant="contained"
              startIcon={<Add />}
              disableRipple
              sx={{ backgroundColor: "primary.main" }}
            >
              New Organization
            </Button>
          </Link>
          <Link href={URL_CONSTANTS.ADMIN_ORGANISATION_MANAGEMENT_NEW}>
            <Button
              variant="contained"
              startIcon={<Add />}
              disableRipple
              sx={{ backgroundColor: "primary.main", ml: 2 }}
            >
              Create Organization & Subscription
            </Button>
          </Link>
        </Box>
      )}
      <ViewOrganisationComponent
        organisationList={organisationList}
        rowsPerPage={rowsPerPage}
        page={page}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        isLoading={isLoading}
        handleUpdateOrganisationStatus={handleUpdateOrganisationStatus}
        handleDeleteOrganisation={handleDeleteOrganisation}
      />
    </Box>
  );
};

export default ViewOrganisationHomePage;
