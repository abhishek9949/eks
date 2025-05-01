"use client";

import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import {
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Box,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ActionCommunity from "@/components/admin/CommunityMangement/actionCommunity";
import {
  CommunityTableListProps,
  GetSingleForumResult,
} from "@/types/community";
import dateFormat from "@/utils/dateFormat";
import { Column } from "@/types/table";
import { getStatusChip } from "@/utils/statusChip";
import clsx from "clsx";
import CommunityFilter from "./CommunityFilter";
import {
  resetCommunityFilters,
  setCommunityFilters,
} from "@/redux/slices/filterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import BlockIcon from "@mui/icons-material/Block";
import BlockDialog from "@/components/admin/ContentManagement/BlockDialog";
import { Organisation } from "@/types/content";

const CommunityTableList = ({
  handleActivateDeactivateFourm,
  forumDetails,
  loading,
  sortColumn,
  sortDirection,
  handleSortChange,
  selectedRows,
  setSelectedRows,
  handleBlockCommunity,
}: CommunityTableListProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(
    (state) => state.filterSlice?.communityFilters,
  );

  const { searchText, page, rowsPerPage } = filters;
  const { cookies } = useAppSelector((state) => state.cookies);
  const userPermissionsList = cookies?.permissionCookie || [];
  const [openUserActionMenu, setOpenUserActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentRow, setCurrentRow] = useState<GetSingleForumResult | null>(
    null,
  );
  const [showCommunityFilter, setShowCommunityFilter] = useState(false);
  const [openForumBlockDialog, setOpenForumBlockDialog] =
    useState<boolean>(false);
  const permissions = cookies?.permissionCookie || [];

  const handleOpenUserActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: GetSingleForumResult,
  ) => {
    setOpenUserActionMenu(event.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseUserActionMenu = () => {
    setOpenUserActionMenu(null);
    setCurrentRow(null);
  };

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    dispatch(setCommunityFilters({ page: newPage + 1 }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      setCommunityFilters({
        rowsPerPage: parseInt(event.target.value, 10),
        page: 1,
      }),
    );
  };

  //Bulk Block Modal Dialog
  const handleOpenForumBlockDialog = () => {
    setOpenForumBlockDialog(true);
  };

  const handleCloseForumBlockDialog = () => {
    setOpenForumBlockDialog(false);
  };

  const handleConfirmBlockForum = (selectedOrganizations: Organisation[]) => {
    const organisationIds = selectedOrganizations.map(
      (org) => org.organisation_id,
    );
    const forumIds = selectedRows.map((forum) => forum?.id);
    handleBlockCommunity(forumIds, organisationIds);
    setSelectedRows([]);
  };

  const columns: Column[] = [
    {
      field: "topic_title",
      label: "Title",
      align: "left",
      isSortable: true,
    },
    {
      field: "user_name",
      label: "Created By",
      align: "left",
    },
    {
      field: "created_at",
      label: "Created Date",
      align: "left",
      isSortable: true,
      render: (value: string) => <div>{dateFormat(value)}</div>,
    },
    {
      field: "status",
      label: "Status",
      align: "left",
      render: (value: "inactive" | "active" | "deleted") =>
        getStatusChip(value),
    },
  ];
  // Only add the "Actions" column if the user has permission
  if (
    checkPermissionExists(
      [
        PERMISSIONS.COMMUNITY_MANAGEMENT.EDIT,
        PERMISSIONS.COMMUNITY_MANAGEMENT.DELETE,
      ],
      userPermissionsList,
    )
  ) {
    columns.push({
      field: "actions",
      label: "Actions",
      align: "center",
      render: (value: string, row: GetSingleForumResult) => (
        <div>
          <IconButton
            id={`user-action-long-button-${row.forum_id}`}
            aria-controls={openUserActionMenu ? "basic-menu" : undefined}
            aria-expanded={openUserActionMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenUserActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          <ActionCommunity
            openUserActionMenu={openUserActionMenu}
            handleCloseUserActionMenu={handleCloseUserActionMenu}
            row={currentRow as GetSingleForumResult}
            handleActivateDeactivateFourm={handleActivateDeactivateFourm}
          />
        </div>
      ),
    });
  }

  return (
    <>
      <Box className="!mb-4 flex items-center justify-between">
        <Box>
          <TextField
            id="outlined-basic"
            placeholder="Search"
            variant="outlined"
            className={clsx("!me-4", showCommunityFilter && "bg-gray-3")}
            disabled={showCommunityFilter}
            size="small"
            value={searchText}
            onChange={(e) => {
              dispatch(
                setCommunityFilters({
                  searchText: e.target.value,
                  page: 1,
                }),
              );
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button
            className="cursor-pointer"
            onClick={() => {
              setShowCommunityFilter(!showCommunityFilter);
              dispatch(resetCommunityFilters());
            }}
          >
            Advanced Search
          </Button>
        </Box>
        <Box>
          {selectedRows?.length > 0 && (
            <Box>
              <Button
                variant="contained"
                startIcon={<BlockIcon />}
                onClick={() => {
                  handleOpenForumBlockDialog();
                }}
                disableRipple
              >
                Block
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      {showCommunityFilter && <CommunityFilter />}
      <CommonTable
        columns={columns}
        data={
          forumDetails && "results" in forumDetails
            ? forumDetails.results?.map((forum) => ({
                ...forum,
                id: forum.forum_id,
              }))
            : []
        }
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={
          forumDetails && "count" in forumDetails ? forumDetails.count : 0
        }
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        enableSelection={
          checkPermissionExists(
            PERMISSIONS.COMMUNITY_MANAGEMENT.BLOCKED,
            permissions,
          ) && true
        }
      />
      <BlockDialog
        open={openForumBlockDialog}
        onClose={handleCloseForumBlockDialog}
        onSubmit={handleConfirmBlockForum}
      />
    </>
  );
};

export default CommunityTableList;
