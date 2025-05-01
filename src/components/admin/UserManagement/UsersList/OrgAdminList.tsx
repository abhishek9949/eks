"use client";
import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import {
  IconButton,
  Paper,
  InputAdornment,
  TextField,
  Box,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UserMenu from "./UserMenu";
import { Column } from "@/types/table";
import { OrgAdminListProps, UserType } from "@/types/userManagementType";
import SearchIcon from "@mui/icons-material/Search";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";
import UserFilter from "./UserFilter";
import clsx from "clsx";
import { getStatusChip } from "@/utils/statusChip";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { useAppSelector } from "@/redux/hooks";

const OrgAdminList = ({
  userData,
  handlePageChange,
  handleRowsPerPageChange,
  page,
  rowsPerPage,
  handleSearchText,
  searchText,
  sortColumn,
  sortDirection,
  handleSortChange,
  handleUpdateUserStatus,
  handleOpenFilter,
  openFilter,
  loading,
  handleResendUserInvitation,
}: OrgAdminListProps) => {
  const [openUserActionMenu, setOpenUserActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentRow, setCurrentRow] = useState<UserType | null>(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const { cookies } = useAppSelector((state) => state.cookies);
  const userPermissionsList = cookies?.permissionCookie || [];

  const handleOpenUserActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: UserType,
  ) => {
    setOpenUserActionMenu(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseUserActionMenu = () => {
    setOpenUserActionMenu(null);
    setCurrentRow(null);
  };

  const statusUpdate = (row: UserType) => {
  if (!row.is_active && row?.invite_status === "Pending") {
      return getStatusChip("pending");
    } else if (row?.invite_status === "Expired") {
      return getStatusChip("expired");
    } else if (!row?.is_active) {
      return getStatusChip("inactive");
    } else {
      return getStatusChip("active");
    }
  };

  const columns: Column[] = [
    {
      field: "first_name",
      label: "Name",
      align: "left",
      isSortable: true,
      render: (value, row) => (
        <span>{`${row?.first_name} ${row?.last_name}`}</span>
      ),
    },
    { field: "email", label: "Email", isSortable: true, align: "left" },
    {
      field: "role",
      label: "Role",
      align: "left",
      render: (value, row) => <div>{row?.roles}</div>,
    },
    {
      field: "is_active",
      label: "Status",
      align: "left",
      isSortable: true,
      render: (value, row) =>
        statusUpdate(row),
    },
  ];

  // Only add the "Actions" column if the user has permission
  if (
    checkPermissionExists(
      [
        PERMISSIONS.USER_MANAGEMENT.EDIT,
        PERMISSIONS.USER_MANAGEMENT.DELETE,
        PERMISSIONS.USER_MANAGEMENT.RESEND_INVITATION,
      ],
      userPermissionsList,
    )
  ) {
    columns.push({
      field: "actions",
      label: "Actions",
      align: "center",
      render: (value, row) => (
        <div>
          <IconButton
            id={`user-action-long-button-${row.id}`}
            aria-controls={openUserActionMenu ? "basic-menu" : undefined}
            aria-expanded={openUserActionMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenUserActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          {currentRow && (
            <UserMenu
              openUserActionMenu={openUserActionMenu}
              handleCloseUserActionMenu={handleCloseUserActionMenu}
              row={currentRow}
              handleUpdateUserStatus={handleUpdateUserStatus}
              handleResendUserInvitation={handleResendUserInvitation}
            />
          )}
        </div>
      ),
    });
  }

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Box className="mb-4 me-4 flex items-center gap-4">
        <Box>
          <TextField
            id="search-in-user-table"
            className={clsx(openFilter && "bg-gray-3")}
            placeholder="Search..."
            size="small"
            value={searchText}
            onChange={handleSearchText}
            disabled={openFilter}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box>
          <Button className="cursor-pointer" onClick={handleOpenFilter}>
            Advanced Search
          </Button>
        </Box>
        <Box>
          {selectedRows?.length > 0 && (
            <Fab
              variant="circular"
              size="small"
              color="primary"
              onClick={() => {
                setSelectedRows([]);
              }}
            >
              <DeleteIcon />
            </Fab>
          )}
        </Box>
      </Box>
      {openFilter && <UserFilter />}
      <CommonTable
        columns={columns}
        data={userData && "results" in userData ? userData.results : []}
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={userData && "count" in userData ? userData.count : 0}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        enableSelection={false}
        loading={loading}
      />
    </Paper>
  );
};

export default OrgAdminList;
