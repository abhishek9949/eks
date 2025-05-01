"use client";
import React, { useEffect, useState } from "react";
import { Column } from "@/types/table";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import { MoreVert, Search } from "@mui/icons-material";
import {
  IndividualSubscriptionProps,
  ViewSubscriptionProps,
} from "@/types/subscription";
import clsx from "clsx";
import {
  CommonTableComponent,
  SubscriptionFilterComponent,
  SubscriptionMoreActionsComponent,
} from "@/components/common/DynamicImports";
import useDebounce from "@/hooks/useDebounce";
import dateFormat from "@/utils/dateFormat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setSubscriptionFilters,
  resetSubscriptionFilters,
} from "@/redux/slices/filterSlice";
import { getStatusChip } from "@/utils/statusChip";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ViewSubsciptionPlan = ({
  subscriptionDetails,
  handleDeleteSubscriptionPlan,
  handleChangeSubscriptionPlanStatus,
  page,
  rowsPerPage,
  handlePageChange,
  handleRowsPerPageChange,
  handlePublishSubscriptionPlan,
  loading,
}: ViewSubscriptionProps) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openMoreActions, setOpenMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const [showSubscriptionFilter, setShowSubscriptionFilter] = useState(false);
  const [currentRow, setCurrentRow] =
    useState<IndividualSubscriptionProps | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const dispatch = useAppDispatch();
  const { cookies } = useAppSelector((state) => state.cookies);
  const userPermissionsList = cookies?.permissionCookie || [];

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleOpenMoreActions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: IndividualSubscriptionProps,
  ) => {
    setOpenMoreActions(event?.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseMoreActions = () => {
    setOpenMoreActions(null);
  };

  const renderStatus = (row: IndividualSubscriptionProps) => {
    if (!row?.is_published) {
      return getStatusChip("draft");
    } else if (row?.is_active) {
      return getStatusChip("active");
    } else {
      return getStatusChip("inactive");
    }
  };

  const columns: Column[] = [
    { field: "plan_name", label: "Plan Name", align: "left", isSortable: true },
    {
      field: "monthly_value",
      label: "Monthly Price",
      align: "left",
      isSortable: false,
      render: (value, row) => {
        return (
          <span>
            {row?.monthly_value} {row?.currency}
          </span>
        );
      },
    },
    {
      field: "annually_value",
      label: "Annual Price",
      align: "left",
      isSortable: false,
      render: (value, row) => {
        return (
          <span>
            {row?.annually_value} {row?.currency}
          </span>
        );
      },
    },
    {
      field: "plan_type",
      label: "Plan Type",
      align: "left",
      isSortable: false,
    },
    {
      field: "is_active",
      label: "Status",
      align: "left",
      isSortable: false,
      render: (value, row) => renderStatus(row),
    },
    {
      field: "max_licenses",
      label: "No of Licenses",
      align: "left",
      isSortable: false,
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
        PERMISSIONS.SUBSCRIPTION_PLANS.EDIT,
        PERMISSIONS.SUBSCRIPTION_PLANS.DELETE,
        PERMISSIONS.SUBSCRIPTION_PLANS.SUSPEND_ACTIVATE,
        PERMISSIONS.SUBSCRIPTION_PLANS.PUBLISH_SUBSCRIPTIONS,
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
          <SubscriptionMoreActionsComponent
            openMoreActions={openMoreActions}
            handleCloseMoreActions={handleCloseMoreActions}
            row={currentRow}
            handleDeleteSubscriptionPlan={handleDeleteSubscriptionPlan}
            handleChangeSubscriptionPlanStatus={
              handleChangeSubscriptionPlanStatus
            }
            handlePublishSubscriptionPlan={handlePublishSubscriptionPlan}
          />
        </div>
      ),
    });
  }

  useEffect(() => {
    dispatch(
      setSubscriptionFilters({
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
          className={clsx("!mb-4 !me-4", showSubscriptionFilter && "bg-gray-3")}
          placeholder="Search..."
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={showSubscriptionFilter}
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
            setShowSubscriptionFilter(!showSubscriptionFilter);
            dispatch(resetSubscriptionFilters());
            setSearchText("");
          }}
        >
          Advanced Search
        </Button>
      </Grid2>
      {showSubscriptionFilter && <SubscriptionFilterComponent />}
      <CommonTableComponent
        columns={columns}
        data={
          subscriptionDetails && "results" in subscriptionDetails
            ? subscriptionDetails.results
            : []
        }
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={
          subscriptionDetails && "count" in subscriptionDetails
            ? subscriptionDetails.count
            : 0
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

export default ViewSubsciptionPlan;
