"use client";
import React, { useEffect, useState } from "react";
import { MoreVert, Search } from "@mui/icons-material";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import clsx from "clsx";
import {
  IndividualOrganisationProps,
  ViewOrganisationProps,
} from "@/types/organisation";
import { CommonTableComponent } from "@/components/common/DynamicImports";
import { Column } from "@/types/table";
import OrganisationMoreActions from "./OrganisationMoreActions";
import OrganisationFilter from "./OrganisationFilter";
import useDebounce from "@/hooks/useDebounce";
import dateFormat from "@/utils/dateFormat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setOrganisationFilters,
  resetOrganisationFilters,
} from "@/redux/slices/filterSlice";
import { getStatusChip } from "@/utils/statusChip";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { checkPermissionExists } from "@/utils/permissionFormate";

const ViewOrganisation = ({
  organisationList,
  rowsPerPage,
  page,
  handlePageChange,
  handleRowsPerPageChange,
  isLoading,
  handleUpdateOrganisationStatus,
  handleDeleteOrganisation,
}: ViewOrganisationProps) => {
  const { cookies } = useAppSelector((state) => state.cookies);
  const userPermissionsList = cookies?.permissionCookie || [];

  const [searchText, setSearchText] = useState("");
  const [showOrganisationFilter, setShowOrganisationFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openMoreActions, setOpenMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const [currentRow, setCurrentRow] =
    useState<IndividualOrganisationProps | null>(null);
  const debouncedSearchText = useDebounce(searchText, 500);
  const dispatch = useAppDispatch();

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleOpenMoreActions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: IndividualOrganisationProps,
  ) => {
    setOpenMoreActions(event?.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseMoreActions = () => {
    setOpenMoreActions(null);
  };

  let columns: Column[] = [
    {
      field: "organisation_name",
      label: "Organization Name",
      align: "left",
      isSortable: true,
    },
    {
      field: "organisation_type",
      label: "Organization Type",
      align: "left",
      isSortable: false,
    },
    {
      field: "subscription_plan",
      label: "Subscription Plan",
      align: "left",
      isSortable: false,
    },
    {
      field: "total_count",
      label: "No of Users",
      align: "left",
      isSortable: false,
      render: (value, row) => <span>{row?.user_summary?.total_count}</span>,
    },
    {
      field: "is_active",
      label: "Status",
      align: "left",
      isSortable: false,
      render: (value, row) =>
        getStatusChip(row?.is_active ? "active" : "inactive"),
    },
    {
      field: "created_at",
      label: "Created On",
      align: "left",
      isSortable: true,
      render: (value: string) => <span>{value && dateFormat(value)}</span>,
    },
  ];

  // Only add the "Actions" column if the user has permission
  if (
    checkPermissionExists(
      [
        PERMISSIONS.ORGANIZATIONS.SUSPEND_ACTIVATE,
        PERMISSIONS.ORGANIZATIONS.REMOVE,
        PERMISSIONS.ORGANIZATIONS.EDIT,
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
            aria-controls={openMoreActions ? "basic-menu" : undefined}
            aria-expanded={openMoreActions ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenMoreActions(event, row)}
          >
            <MoreVert />
          </IconButton>
          <OrganisationMoreActions
            openMoreActions={openMoreActions}
            handleCloseMoreActions={handleCloseMoreActions}
            row={currentRow}
            handleUpdateOrganisationStatus={handleUpdateOrganisationStatus}
            handleDeleteOrganisation={handleDeleteOrganisation}
          />
        </div>
      ),
    });
  }

  useEffect(() => {
    dispatch(
      setOrganisationFilters({
        searchText: debouncedSearchText,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      }),
    );
  }, [sortDirection, debouncedSearchText, sortColumn]);

  return (
    <Paper className="full-width mb-2 p-2">
      <Grid2 container alignItems="baseline">
        <TextField
          id="search-in-table"
          className={clsx("!mb-4 !me-4", showOrganisationFilter && "bg-gray-3")}
          placeholder="Search..."
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={showOrganisationFilter}
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
            setShowOrganisationFilter(!showOrganisationFilter);
            setSearchText("");
            dispatch(resetOrganisationFilters());
          }}
        >
          Advanced Search
        </Button>
      </Grid2>
      {showOrganisationFilter && <OrganisationFilter />}
      <CommonTableComponent
        columns={columns}
        data={
          organisationList && "results" in organisationList
            ? organisationList?.results
            : []
        }
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={
          organisationList && "count" in organisationList
            ? organisationList?.count
            : 0
        }
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        enableSelection={false}
        loading={isLoading}
      />
    </Paper>
  );
};

export default ViewOrganisation;
