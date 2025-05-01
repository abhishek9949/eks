"use client";

import React, { useEffect, useState } from "react";
import GroupsIcon from "@mui/icons-material/Groups";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Link from "next/link";
import {
  useUpdateUserStatusMutation,
  useLazyGetUsersQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { TabPanelProps, UserDetailsResponse } from "@/types/userManagementType";
import {
  BreadcrumbComponent,
  OrgAdminListComponent,
} from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { setUsersFilters, resetUsersFilters } from "@/redux/slices/filterSlice";
import useDebounce from "@/hooks/useDebounce";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

function CustomTabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box className="pt-4">{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `user-list-tab-${index}`,
    "aria-controls": `user-list-tabpanel-${index}`,
  };
}

const Users = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [getUsers] = useLazyGetUsersQuery();
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const [userData, setUserData] = useState<UserDetailsResponse | []>([]);
  const [educatorsData, setEducatorsData] = useState<UserDetailsResponse | []>(
    [],
  );
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const { cookies } = useAppSelector((state) => state.cookies);
  const [currentRoleData, setCurrentRoleData] = useState<{
    role_id: number;
    role_name: string;
  }>();
  const permissions = cookies?.permissionCookie || [];

  const {
    page,
    rowsPerPage,
    searchFirstName,
    searchLastName,
    searchByEmail,
    tabValue,
  } = useAppSelector((state) => state.filterSlice.usersFilters);
  const debouncedSearchText = useDebounce(searchText, 500);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setSearchText("");
    dispatch(
      setUsersFilters({
        searchFirstName: "",
        searchLastName: "",
        searchByEmail: "",
        page: 1,
        rowsPerPage: 5,
        tabValue: newValue,
      }),
    );
  };

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    dispatch(setUsersFilters({ page: newPage + 1 }));
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      setUsersFilters({
        rowsPerPage: parseInt(event.target.value, 10),
        page: 1,
      }),
    );
  };

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    dispatch(
      setUsersFilters({
        page: 1,
      }),
    );
  };

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    dispatch(
      setUsersFilters({
        page: 1,
      }),
    );
  };

  const handleOpenFilter = () => {
    setSearchText("");
    dispatch(
      setUsersFilters({
        page: 1,
      }),
    );
    dispatch(resetUsersFilters());
    setOpenFilter(!openFilter);
  };

  const getUsersData = () => {
    setApiLoading(true);
    getUsers({
      endpoint: `${API_CONSTANTS.GET_USERS_LIST}?page=${page}&page_size=${rowsPerPage}&first_name=${searchFirstName}&last_name=${searchLastName}&email=${searchByEmail}&sort_by=${sortColumn}&order=${sortDirection}&query_text=${debouncedSearchText}`,
    })
      .unwrap()
      .then((getUsersRes) => {
        setUserData(getUsersRes);
        setApiLoading(false);
      })
      .catch((getUsersErr) => {
        dispatch(
          showToastMessage({
            message: getUsersErr?.data?.error,
            severity: "error",
          }),
        );
        setApiLoading(false);
      });
  };

  const handleUpdateUserStatus = (id: number, status: boolean) => {
    updateUserStatus({
      endpoint: API_CONSTANTS.UPDATE_USER_STATUS,
      method: "PUT",
      data: { users_id: [id], is_active: !status },
    })
      .unwrap()
      .then((updateUserStatusRes) => {
        dispatch(
          showToastMessage({
            message: updateUserStatusRes?.message,
            severity: "success",
          }),
        );
        getUsersData();
        getEducatorsData();
      })
      .catch((updateUserStatusErr) => {
        dispatch(
          showToastMessage({
            message: updateUserStatusErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  const handleResendUserInvitation = (id: number) => {
    updateUserStatus({
      endpoint: API_CONSTANTS.RESEND_INVITATION_LINK,
      method: "POST",
      data: { user_id: id },
    })
      .unwrap()
      .then((resendInvitationRes) => {
        dispatch(
          showToastMessage({
            message: resendInvitationRes?.message,
            severity: "success",
          }),
        );
        getUsersData();
      })
      .catch((resendInvitationErr) => {
        dispatch(
          showToastMessage({
            message: resendInvitationErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  const getEducatorsData = () => {
    setApiLoading(true);
    const roleName =
      currentRoleData?.role_id === 1 ? "Educator" : "Organization Educator";
    getUsers({
      endpoint: `${API_CONSTANTS.GET_USERS_LIST}?role_name=${roleName}&page=${page}&page_size=${rowsPerPage}&first_name=${searchFirstName}&last_name=${searchLastName}&email=${searchByEmail}&sort_by=${sortColumn}&order=${sortDirection}&query_text=${debouncedSearchText}`,
    })
      .unwrap()
      .then((getEducatorsRes) => {
        setEducatorsData(getEducatorsRes);
        setApiLoading(false);
      })
      .catch((getEducatorsErr) => {
        dispatch(
          showToastMessage({
            message:
              getEducatorsErr?.data?.error || "Error Featching the Educators",
            severity: "error",
          }),
        );
        setApiLoading(false);
      });
  };

  useEffect(() => {
    if (cookies && typeof cookies === "object") {
      setCurrentRoleData(cookies.currentRoleCookie);
    }
  }, [cookies]);

  useEffect(() => {
    // Only make API calls if currentRoleData is properly set
    if (currentRoleData) {
      if (tabValue === 0) {
        getUsersData();
      } else if (tabValue === 1) {
        getEducatorsData();
      }
    }
  }, [
    page,
    rowsPerPage,
    searchFirstName,
    searchLastName,
    searchByEmail,
    debouncedSearchText,
    sortColumn,
    sortDirection,
    tabValue,
    currentRoleData,
  ]);

  return (
    <div className="relative pt-5.5">
      <PageMetaData title="User List" />
      <BreadcrumbComponent
        levels={[
          {
            name: "User Management",
            path: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER,
            icon: (
              <GroupsIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "User List" },
        ]}
      />
      {checkPermissionExists(
        PERMISSIONS.USER_MANAGEMENT.CREATE,
        permissions,
      ) && (
        <Box className="absolute end-1 top-3.5 z-1">
          <Link href={URL_CONSTANTS.ADMIN_USER_MANAGEMENT_CREATE_USER}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              disableRipple
              sx={{ backgroundColor: "primary.main" }}
            >
              New User
            </Button>
          </Link>
        </Box>
      )}
      <Box>
        <Box className="!border-b">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            aria-label="user list tab"
          >
            <Tab label="Admin" {...a11yProps(0)} disableRipple />
            <Tab label="Educator" {...a11yProps(1)} disableRipple />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
          <OrgAdminListComponent
            userData={userData}
            updateUserStatus={updateUserStatus}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handleSearchText={handleSearchText}
            searchText={searchText}
            page={page}
            rowsPerPage={rowsPerPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSortChange={handleSortChange}
            handleUpdateUserStatus={handleUpdateUserStatus}
            handleOpenFilter={handleOpenFilter}
            openFilter={openFilter}
            loading={apiLoading}
            handleResendUserInvitation={handleResendUserInvitation}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <OrgAdminListComponent
            userData={educatorsData}
            updateUserStatus={updateUserStatus}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
            handleSearchText={handleSearchText}
            searchText={searchText}
            page={page}
            rowsPerPage={rowsPerPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            handleSortChange={handleSortChange}
            handleUpdateUserStatus={handleUpdateUserStatus}
            handleOpenFilter={handleOpenFilter}
            openFilter={openFilter}
            loading={apiLoading}
            handleResendUserInvitation={handleResendUserInvitation}
          />
        </CustomTabPanel>
      </Box>
    </div>
  );
};

export default Users;
