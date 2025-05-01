import CommonTable from "@/components/common/CommonTable";
import { Column } from "@/types/table";
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import GroupMenu from "./GroupMenu";
import dateFormat from "@/utils/dateFormat";
import SearchIcon from "@mui/icons-material/Search";
import {
  GetSingleGroupResultType,
  GroupListPropsType,
} from "@/types/chatAdminTypes";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";

const GroupList = ({
  isLoading,
  groupResObj,
  groupData,
  handleDeleteGroup,
  handlePageChange,
  handleRowsPerPageChange,
  page,
  rowsPerPage,
  handleSearchText,
  searchText,
  sortColumn,
  sortDirection,
  handleSortChange,
  handleUpdateGroupDetails,
}: GroupListPropsType) => {
  const [openGroupMenu, setOpenGroupMenu] = useState<HTMLElement | null>(null);
  const [currentRow, setCurrentRow] = useState<GetSingleGroupResultType | null>(
    null,
  );

  const handleOpenGroupActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: GetSingleGroupResultType,
  ) => {
    setOpenGroupMenu(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseGroupActionMenu = () => {
    setOpenGroupMenu(null);
    setCurrentRow(null);
  };

  const columns: Column[] = [
    {
      field: "group_name",
      label: "Group name",
      align: "left",
      isSortable: true,
      render: (value, row) => (
        <span>
          <Link
            className="text-primary underline hover:no-underline"
            href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_GROUP_ACTION(
              row?.group_id,
              row?.created_by,
              row?.group_name,
            )}
          >
            {row?.group_name}
          </Link>
        </span>
      ),
    },
    {
      field: "is_public",
      label: "Access",
      align: "left",
      isSortable: true,
      render: (value, row) => (
        <span>
          {row?.is_public ? (
            <span className="flex items-center gap-1">
              <LockOpenOutlinedIcon />
              <span>Public</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <LockOutlinedIcon /> <span>Private</span>
            </span>
          )}
        </span>
      ),
    },
    {
      field: "created_at",
      label: "Created date",
      align: "left",
      isSortable: true,
      render: (value, row) => <span>{dateFormat(row?.created_at)}</span>,
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      render: (value, row) => (
        <div>
          <IconButton
            id={`group-list-action-button-${row.id}`}
            aria-controls={openGroupMenu ? "basic-menu" : undefined}
            aria-expanded={openGroupMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenGroupActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          {currentRow && (
            <GroupMenu
              openGroupMenu={openGroupMenu}
              handleCloseGroupActionMenu={handleCloseGroupActionMenu}
              row={currentRow}
              handleDeleteGroup={handleDeleteGroup}
              handleUpdateGroupDetails={handleUpdateGroupDetails}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
      <Box className="mb-4 flex items-center justify-between">
        <Box>
          <TextField
            id="search-in-reported-comments-table"
            placeholder="Search..."
            size="small"
            value={searchText}
            onChange={handleSearchText}
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
      </Box>
      <CommonTable
        columns={columns}
        data={groupData}
        totalRows={
          groupResObj && "count" in groupResObj ? groupResObj?.count : 0
        }
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        loading={isLoading}
        enableSelection={false}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </Paper>
  );
};

export default GroupList;
