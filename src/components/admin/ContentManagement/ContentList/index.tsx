"use client";
import React, { useEffect, useState } from "react";
import { CommonTableComponent } from "@/components/common/DynamicImports";
import { MoreVert, Search } from "@mui/icons-material";
import {
  Button,
  Grid2,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
} from "@mui/material";
import clsx from "clsx";
import ContentFilter from "./ContentFilter";
import { Column } from "@/types/table";
import {
  ContentListProps,
  IndividualContentProps,
  Organisation,
} from "@/types/content";
import ContentMoreActions from "./ContentMoreActions";
import { useCategoryList } from "@/hooks/useCategoryList";
import dateFormat from "@/utils/dateFormat";
import useDebounce from "@/hooks/useDebounce";
import BlockDialog from "@/components/admin/ContentManagement/BlockDialog";
import { getStatusChip } from "@/utils/statusChip";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { resetContentFilters, setContentFilters } from "@/redux/slices/filterSlice";

const ContentList = ({
  handlePageChange,
  handleRowsPerPageChange,
  contentList,
  handleUpdateContentStatus,
  apiLoading,
  page,
  rowsPerPage,
  handleBlockSubmit,
  handleDeleteContent,
}: ContentListProps) => {
  const [showContentFilter, setShowContentFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [openMoreActions, setOpenMoreActions] =
    useState<HTMLButtonElement | null>(null);
  const [currentRow, setCurrentRow] = useState<IndividualContentProps | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const [seletedContent, setSeletedContent] = useState<string[]>([]);
  const [blockDialogOpen, setBlockDialogOpen] = useState<boolean>(false);
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const debouncedSearchText = useDebounce(searchText, 500);
  const { categoryList } = useCategoryList("content");
  const userPermissionsList = cookies?.permissionCookie || [];
  const dispatch = useAppDispatch();

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleOpenMoreActions = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    row: IndividualContentProps,
  ) => {
    setOpenMoreActions(event?.currentTarget);
    setCurrentRow(row);
  };

  const handleCloseMoreActions = () => {
    setOpenMoreActions(null);
  };

  const handleOpenBlockDialog = () => {
    setBlockDialogOpen(true);
  };

  const handleCloseBlockDialog = () => {
    setBlockDialogOpen(false);
  };

  const blockSubmit = (selectedOrganizations: Organisation[]) => {
    const organisationIds = selectedOrganizations.map(
      (org) => org.organisation_id,
    );
    handleBlockSubmit(organisationIds as number[], seletedContent);
    setSeletedContent([]);
  };

  const onSelectAllClick = (value: string) => {
    setSeletedContent((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const columns: Column[] = [
    {
      field: "_id",
      label: "",
      align: "left",
      render: (value: any) => {
        return (
          <span>
            <Checkbox
              checked={seletedContent.includes(value)} // Ensure checkbox is checked based on state
              color="primary"
              onChange={() => onSelectAllClick(value)}
              sx={{
                "& .MuiCheckbox-input": {
                  "aria-label": "select content",
                },
              }}
            />
          </span>
        );
      },
    },
    { field: "title", label: "Title", align: "left", isSortable: true },
    {
      field: "content_type",
      label: "Content Type",
      align: "left",
      isSortable: false,
    },
    {
      field: "categories",
      label: "Category",
      align: "left",
      isSortable: false,
      render: (value: any) => {
        return (
          <span>
            {value.map((item: { name: string }) => item.name).join(", ")}
          </span>
        );
      },
    },
    {
      field: "publish_status",
      label: "Status",
      align: "left",
      isSortable: false,
      render: (value: string) => getStatusChip(value),
    },
    {
      field: "author_name",
      label: "Created By",
      align: "left",
      isSortable: false,
    },
    {
      field: "created_at",
      label: "Created On",
      align: "left",
      isSortable: true,
      render: (value: string) => {
        return <span>{dateFormat(value)}</span>;
      },
    },
  ];

  // Only add the "Actions" column if the user has permission
  if (
    checkPermissionExists(
      [
        PERMISSIONS.CONTENT_MANAGEMENT.EDIT,
        PERMISSIONS.CONTENT_MANAGEMENT.DELETE,
        PERMISSIONS.CONTENT_MANAGEMENT.LIST,
        PERMISSIONS.CONTENT_MANAGEMENT.SUSPEND_ACTIVATE_CONTENT,
        PERMISSIONS.CONTENT_MANAGEMENT.PUBLISH_CONTENT,
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
          <ContentMoreActions
            openMoreActions={openMoreActions}
            handleCloseMoreActions={handleCloseMoreActions}
            row={currentRow}
            handleUpdateContentStatus={handleUpdateContentStatus}
            handleDeleteContent={handleDeleteContent}
          />
        </div>
      ),
    });
  }

  useEffect(() => {
    dispatch(setContentFilters({
      searchText: debouncedSearchText,
      sortColumn,
      sortDirection,
    }))
  }, [sortDirection, debouncedSearchText]);

  return (
    <>
      <Grid2 container alignItems="baseline" className="!mb-4 flex">
        <Grid2 size={11}>
          <TextField
            id="search-in-table"
            className={clsx("mb-4 me-4", showContentFilter && "bg-gray-3")}
            placeholder="Search..."
            size="small"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            disabled={showContentFilter}
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
              setShowContentFilter(!showContentFilter);
              setSearchText("");
              dispatch(resetContentFilters());
            }}
          >
            Advanced Search
          </Button>
        </Grid2>
        {checkPermissionExists(
          PERMISSIONS.CONTENT_MANAGEMENT.BLOCKED,
          permissions,
        ) && (
          <Grid2 size={1} className="!flex justify-end">
            {seletedContent.length > 0 && (
              <Button
                className="cursor-pointer  !justify-end "
                variant="contained"
                onClick={handleOpenBlockDialog}
                disableRipple
                sx={{ backgroundColor: "primary.main" }}
              >
                Block
              </Button>
            )}
          </Grid2>
        )}
      </Grid2>
      {showContentFilter && (
        <ContentFilter
          categoryList={categoryList}
        />
      )}
      <CommonTableComponent
        columns={columns}
        data={
          contentList && "results" in contentList ? contentList.results : []
        }
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={
          contentList && "count" in contentList ? contentList.count : 0
        }
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        enableSelection={false}
        loading={apiLoading}
      />
      <BlockDialog
        open={blockDialogOpen}
        onClose={handleCloseBlockDialog}
        onSubmit={blockSubmit}
      />
    </>
  );
};

export default ContentList;
