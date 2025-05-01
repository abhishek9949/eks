'use client';
import React, { useEffect, useState } from "react";
import { useDeleteRoleMutation, useLazyGetRolesQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { RoleDetailsProps } from "@/types/roleAndPermission";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import { BreadcrumbComponent, RoleListComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ViewRoleHomePage = () => {
  const [getRoles] = useLazyGetRolesQuery();
  const [deleteRole] = useDeleteRoleMutation();
  const [roleDetails, setRoleDetails] = useState<RoleDetailsProps | []>([]);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [apiLoading, setApiLoading] = useState(false);
  const [callApi, setCallApi] = useState(true);
  const filters = useAppSelector((state) => state?.filterSlice?.roleFilters);
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const getRolesList = (setPageNumber: boolean) => {
    const { roleName, roleDescription, searchText, createdAt, sortColumn, sortDirection } = filters;
    let pageNumber = page;
    if (setPageNumber) {
      pageNumber = 1;
      setCallApi(false);
      setPage(1);
    }
    setApiLoading(true)
    getRoles({
      endpoint: `${API_CONSTANTS.GET_ROLES_LIST}?page=${pageNumber}&page_size=${rowsPerPage}&query_text=${searchText}&role_name=${roleName}&description=${roleDescription}&created_at=${createdAt}&sort_by=${sortColumn}&order=${sortDirection}`
    }).unwrap().then((result) => {
      setRoleDetails(result as RoleDetailsProps);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    }).finally(() => {
      setCallApi(true);
      setApiLoading(false);
    })
  }

  useEffect(() => {
    getRolesList(true);
  }, [filters]);

  useEffect(() => {
    if (callApi) {
      getRolesList(false);
    }
  }, [page, rowsPerPage]);

  const handleDeleteRole = (roleId: number | undefined) => {
    deleteRole({
      endpoint: API_CONSTANTS.DELETE_ROLE + roleId + "/",
      method: 'DELETE'
    }).unwrap().then((result) => {
      if (result) {
        dispatch(showToastMessage({ message: result?.message, severity: "success" }));
        getRolesList(false);
      }
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  };

  const handlePageChange = (event: React.MouseEvent | null, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className="relative pt-5.5">
      <PageMetaData title="Roles List" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Role and Permission",
            path: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW,
            icon: (
              <EngineeringOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Roles List" },
        ]}
      />
      <Box className="absolute end-1 top-3.5 z-1">
        <Link href={URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_CREATE}>
        {checkPermissionExists(PERMISSIONS.ROLES_PERMISSIONS.CREATE, permissions) && (
          <Button variant="contained" startIcon={<Add />} disableRipple sx={{ backgroundColor:"primary.main" }}>
            New Role
          </Button>
          )}  
        </Link>
      </Box>
        <RoleListComponent
          roleDetails={roleDetails}
          handleDeleteRole={handleDeleteRole}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          loading={apiLoading}
        />
    </div>
  );
};

export default ViewRoleHomePage;