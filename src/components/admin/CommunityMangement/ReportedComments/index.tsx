"use client";
import React, { useState } from "react";
import CommonTable from "@/components/common/CommonTable";
import {
  Chip,
  IconButton,
  Paper,
  InputAdornment,
  TextField,
  Box,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ReportedCommentsMenu from "./ReportedCommentsMenu";
import { Column } from "@/types/table";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { truncateString } from "@/utils/reusableFunctions";
import {
  ReportedCommentsProps,
  SingleReportedData,
} from "@/types/community/ReportedCommentsType";
import ModalDialog from "@/components/common/ModalDialog";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomTooltip } from "@/components/common/Tooltip";
import OtherReasonsMenu from "./OtherReasonsMenu";


const ReportedCommentsComp = ({
  reportedCommentsData,
  reportedCommentObj,
  handlePageChange,
  handleRowsPerPageChange,
  page,
  rowsPerPage,
  handleSearchText,
  searchText,
  handleDeleteReportedComments,
  handleIgnoreReportedComments,
  loading,
  selectedRows,
  setSelectedRows,
}: ReportedCommentsProps) => {
  const [openReportCommentActionMenu, setOpenReportCommentActionMenu] =
    useState<HTMLElement | null>(null);
  const [currentRow, setCurrentRow] = useState<SingleReportedData | null>(null);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
  const [openBulkIgnoreDialog, setOpenBulkIgnoreDialog] = useState(false);
  const [openOtherReportMenu, setOpenOtherReportMenu] =
    useState<HTMLElement | null>(null);

  const handleOpenOtherReportMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: SingleReportedData,
  ) => {
    setOpenOtherReportMenu(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseOtherReportMenu = () => {
    setOpenOtherReportMenu(null);
    setCurrentRow(null);
  };

  const handleOpenReportCommentActionMenu = (
    event: React.MouseEvent<HTMLElement>,
    row: SingleReportedData,
  ) => {
    setOpenReportCommentActionMenu(event.currentTarget);
    setCurrentRow(row);
  };
  const handleCloseReportCommentActionMenu = () => {
    setOpenReportCommentActionMenu(null);
    setCurrentRow(null);
  };

  //Bulk Delete Modal Dialog
  const handleOpenBulkDeleteDialog = () => {
    setOpenBulkDeleteDialog(true);
  };

  const handleCloseBulkDeleteDialog = () => {
    setOpenBulkDeleteDialog(false);
  };

  const handleConfirmBulkDelete = () => {
    handleDeleteReportedComments(
      selectedRows.map((comment) => comment?.comment_id),
    );
    setSelectedRows([]);
    setOpenBulkDeleteDialog(false);
  };

  //Bulk Ignore Modal Dialog
  const handleOpenBulkIgnoreDialog = () => {
    setOpenBulkIgnoreDialog(true);
  };

  const handleCloseBulkIgnoreDialog = () => {
    setOpenBulkIgnoreDialog(false);
  };

  const handleConfirmBulkIgnore = () => {
    handleIgnoreReportedComments(
      selectedRows.map((comment) => comment?.comment_id),
    );
    setSelectedRows([]);
    setOpenBulkIgnoreDialog(false);
  };

  const columns: Column[] = [
    {
      field: "content",
      label: "Comments",
      align: "left",
      isSortable: false,
      render: (value, row) => (
        <CustomTooltip title={row?.content} placement="top">
          <div className="bg-blue-light-16 h-auto rounded-md p-2">{`${truncateString(row?.content)}`}</div>
        </CustomTooltip>
      ),
    },
    {
      field: "user_name",
      label: "Commenter",
      isSortable: false,
      align: "left",
      render: (value, row) => (
        <div className="font-semibold text-primary">{row?.user_name}</div>
      ),
    },
    {
      field: "forum_name",
      label: "Content Title",
      align: "left",
      isSortable: false,
      render: (value, row) => (
        <CustomTooltip title={row?.forum_name} placement="top">
          <div className="underline">{truncateString(row?.forum_name)}</div>
        </CustomTooltip>
      ),
    },
    {
      field: "report_count_by_reason",
      label: "Reported By",
      align: "left",
      isSortable: false,
      render: (value, row) => <div>{row?.report_count_by_reason} People</div>,
    },
    {
      field: "reason_text",
      label: "Report Type",
      align: "left",
      isSortable: false,
      render: (value, row) => (
        <>
          {row?.reason_id === 7 ? (
            <Chip
              label={row?.reason_text}
              size="small"
              variant="outlined"
              color="primary"
              deleteIcon={<ExpandMoreIcon />}
              onClick={(event) => handleOpenOtherReportMenu(event, row)}
              onDelete={(event) => handleOpenOtherReportMenu(event, row)}
            />
          ) : (
            <Chip
              label={row?.reason_text}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {currentRow && (
            <OtherReasonsMenu
              openOtherReportMenu={openOtherReportMenu}
              handleCloseOtherReportMenu={handleCloseOtherReportMenu}
              row={currentRow}
            />
          )}
        </>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      align: "center",
      render: (value, row) => (
        <div>
          <IconButton
            id={`user-action-long-button-${row.id}`}
            aria-controls={
              openReportCommentActionMenu ? "basic-menu" : undefined
            }
            aria-expanded={openReportCommentActionMenu ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => handleOpenReportCommentActionMenu(event, row)}
          >
            <MoreVertIcon />
          </IconButton>
          {currentRow && (
            <ReportedCommentsMenu
              openReportCommentActionMenu={openReportCommentActionMenu}
              handleCloseReportCommentActionMenu={
                handleCloseReportCommentActionMenu
              }
              row={currentRow}
              handleDeleteReportedComments={handleDeleteReportedComments}
              handleIgnoreReportedComments={handleIgnoreReportedComments}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <Box className="mb-4 me-4 flex items-center justify-between">
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
          <Box>
            {selectedRows?.length > 0 && (
              <Box>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutlinedIcon />}
                  className="!mr-2"
                  onClick={() => {
                    handleOpenBulkDeleteDialog();
                  }}
                  disableRipple
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<VisibilityOffOutlinedIcon />}
                  onClick={() => {
                    handleOpenBulkIgnoreDialog();
                  }}
                  disableRipple
                >
                  Ignore
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        <CommonTable
          columns={columns}
          data={reportedCommentsData}
          rowsPerPage={rowsPerPage}
          page={page}
          totalRows={
            reportedCommentObj && "count" in reportedCommentObj
              ? reportedCommentObj.count
              : 0
          }
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          enableSelection={true}
          loading={loading}
        />
      </Paper>
      <ModalDialog
        dialogTitle={"Are you sure you want to delete selected comments?"}
        dialogDescription={""}
        openDialog={openBulkDeleteDialog}
        handleCloseDialog={handleCloseBulkDeleteDialog}
        handleConfirm={handleConfirmBulkDelete}
      />

      <ModalDialog
        dialogTitle={"Are you sure you want to ignore selected comments?"}
        dialogDescription={""}
        openDialog={openBulkIgnoreDialog}
        handleCloseDialog={handleCloseBulkIgnoreDialog}
        handleConfirm={handleConfirmBulkIgnore}
      />
    </>
  );
};

export default ReportedCommentsComp;
