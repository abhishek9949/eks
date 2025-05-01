"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { Column } from "@/types/table";
import { RoleProps, ViewRoleProps } from "@/types/roleAndPermission";
import { Search, MoreVert } from "@mui/icons-material";
import clsx from "clsx";
import {
  CommonTableComponent,
  RoleFilterComponent,
  RoleMenuComponent,
} from "@/components/common/DynamicImports";
import useDebounce from "@/hooks/useDebounce";
import dateFormat from "@/utils/dateFormat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setRoleFilters, resetRoleFilters } from "@/redux/slices/filterSlice";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ViewRole = ({
  roleDetails,
  handleDeleteRole,
  page,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  loading,
}: ViewRoleProps) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [roleMoreActions, setRoleMoreActions] = useState<HTMLElement | null>(
    null,
  );
  const [currentRow, setCurrentRow] = useState<RoleProps | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const dispatch = useAppDispatch();
  const { cookies } = useAppSelector((state) => state.cookies);
  const userPermissionsList = cookies?.permissionCookie || [];

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleOpenRoleActionsMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: RoleProps,
  ) => {
    setRoleMoreActions(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseRoleActionsMenu = () => {
    setRoleMoreActions(null);
    setCurrentRow(null);
  };

  const columns: Column[] = [
    { field: "role_name", label: "Role Name", align: "left", isSortable: true },
    {
      field: "description",
      label: "Role Description",
      align: "left",
      isSortable: false,
    },
    {
      field: "created_at",
      label: "Created On",
      align: "left",
      isSortable: true,
      render: (value: any) => <span>{dateFormat(value)}</span>,
    },
  ];

  // Only add the "Actions" column if the user has permission
  if (
    checkPermissionExists(
      [
        PERMISSIONS.ROLES_PERMISSIONS.EDIT,
        PERMISSIONS.ROLES_PERMISSIONS.DELETE,
      ],
      userPermissionsList,
    )
  ) {
    columns.push({
      field: "actions",
      label: "Actions",
      align: "left",
      render: (value: any, row: any) => (
        <div>
          <IconButton
            id={`user-action-long-button-${row.id}`}
            aria-controls={roleMoreActions ? "basic-menu" : undefined}
            aria-expanded={roleMoreActions ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenRoleActionsMenu(event, row)}
          >
            <MoreVert />
          </IconButton>
          <RoleMenuComponent
            roleMoreActions={roleMoreActions}
            handleCloseRoleActionsMenu={handleCloseRoleActionsMenu}
            row={currentRow}
            handleDeleteRole={handleDeleteRole}
          />
        </div>
      ),
    });
  }

  useEffect(() => {
    dispatch(
      setRoleFilters({
        searchText: debouncedSearchText,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      }),
    );
  }, [sortDirection, debouncedSearchText, sortColumn]);

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Grid2 container alignItems="baseline">
        <TextField
          id="search-in-table"
          className={clsx("!mb-4 !me-4", showRoleFilter && "bg-gray-3")}
          placeholder="Search..."
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={showRoleFilter}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            dispatch(resetRoleFilters());
            setSearchText("");
            setShowRoleFilter(!showRoleFilter);
          }}
        >
          Advanced Search
        </Button>
      </Grid2>
      {showRoleFilter && <RoleFilterComponent />}
      <CommonTableComponent
        columns={columns}
        data={
          roleDetails && "results" in roleDetails ? roleDetails.results : []
        }
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={
          roleDetails && "count" in roleDetails ? roleDetails.count : 0
        }
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        enableSelection={false}
        loading={loading}
      />
    </Paper>
  );
};

export default ViewRole;
