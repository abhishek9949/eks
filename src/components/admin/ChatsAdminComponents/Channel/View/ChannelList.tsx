import CommonTable from "@/components/common/CommonTable";
import { Column } from "@/types/table";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ChannelMenu from "./ChannelMenu";
import dateFormat from "@/utils/dateFormat";
import SearchIcon from "@mui/icons-material/Search";
import BlockIcon from "@mui/icons-material/Block";
import BlockDialog from "@/components/admin/ContentManagement/BlockDialog";
import { Organisation } from "@/types/content";
import { ChannelListPropsType, ChannelListType } from "@/types/chatAdminTypes";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { useAppSelector } from "@/redux/hooks";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ChannelList = ({
  isLoading,
  channelsResObj,
  channelsData,
  handleDeleteChannel,
  selectedRows,
  setSelectedRows,
  handleBlockChannel,
  handlePageChange,
  handleRowsPerPageChange,
  page,
  rowsPerPage,
  handleSearchText,
  searchText,
  sortColumn,
  sortDirection,
  handleSortChange,
}: ChannelListPropsType) => {
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  const [openChannelMenu, setOpenChannelMenu] = useState<HTMLElement | null>(
    null,
  );
  const [currentRow, setCurrentRow] = useState<ChannelListType | null>(null);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);

  const handleOpenChannelActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: ChannelListType,
  ) => {
    setOpenChannelMenu(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseChannelActionMenu = () => {
    setOpenChannelMenu(null);
    setCurrentRow(null);
  };

  //Bulk Block Modal Dialog
  const handleOpenBlockDialog = () => {
    setOpenBlockDialog(true);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleConfirmBlockChannel = (selectedOrganizations: Organisation[]) => {
    const organisationIds = selectedOrganizations.map(
      (org) => org.organisation_id,
    );
    const channelIds = selectedRows.map((channel) => channel?.id);
    handleBlockChannel(channelIds, organisationIds);
    setSelectedRows([]);
  };

  const columns: Column[] = [
    {
      field: "channel_name",
      label: "Channel name",
      align: "left",
      isSortable: true,
      render: (value, row) => <span>{row?.channel_name}</span>,
    },
    {
      field: "description",
      label: "Channel description",
      align: "left",
      render: (value, row) => <span>{row?.description}</span>,
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
            id={`channel=list-action-button-${row.id}`}
            aria-controls={openChannelMenu ? "basic-menu" : undefined}
            aria-expanded={openChannelMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenChannelActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          {currentRow && (
            <ChannelMenu
              openChannelMenu={openChannelMenu}
              handleCloseChannelActionMenu={handleCloseChannelActionMenu}
              row={currentRow}
              handleDeleteChannel={handleDeleteChannel}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
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
          {checkPermissionExists(
            PERMISSIONS.CHAT_MANAGEMENT.BLOCKED_CHANNEL,
            permissions,
          ) && (
            <Box>
              {selectedRows?.length > 0 && (
                <Box>
                  <Button
                    variant="contained"
                    startIcon={<BlockIcon />}
                    onClick={() => {
                      handleOpenBlockDialog();
                    }}
                    disableRipple
                  >
                    Block
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
        <CommonTable
          columns={columns}
          data={channelsData}
          totalRows={
            channelsResObj?.data &&
            typeof channelsResObj.data === "object" &&
            "count" in channelsResObj.data
              ? channelsResObj.data.count
              : 0
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          loading={isLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          enableSelection={
            checkPermissionExists(
              PERMISSIONS.CHAT_MANAGEMENT.BLOCKED_CHANNEL,
              permissions,
            ) && true
          }
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
        />
      </Paper>
      <BlockDialog
        open={openBlockDialog}
        onClose={handleCloseBlockDialog}
        onSubmit={handleConfirmBlockChannel}
      />
    </>
  );
};

export default ChannelList;
