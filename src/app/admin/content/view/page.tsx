"use client";

import React, { useEffect, useState } from "react";
import {
  BreadcrumbComponent,
  ContentListComponent,
} from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Link from "next/link";
import { Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MenuBookOutlined } from "@mui/icons-material";
import {
  useLazyGetContentListQuery,
  useUpdateContentStatusMutation,
  useBlockContentMutation,
  useDeleteContentMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  ContentDetailsProps,
  UpdateContentStatusSuccessProps,
} from "@/types/content";
import PageMetaData from "@/components/common/PageMetaData";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { useCheckContentCreatorProfile } from "@/hooks/useCheckContentCreatorProfile";
import CheckContentCreatorProfileDialog from "@/components/admin/ContentManagement/CheckContentCreatorProfileDialog";

const ContentHomePage = () => {
  const { checkContentCreatorRes } = useCheckContentCreatorProfile();
  const [apiLoading, setApiLoading] = useState(false);
  const [getContentList] = useLazyGetContentListQuery();
  const [contentList, setContentList] = useState<ContentDetailsProps>();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [callApi, setCallApi] = useState(true);
  const [updateContentStatus] = useUpdateContentStatusMutation();
  const [blockContent] = useBlockContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  const filters = useAppSelector((state) => state.filterSlice?.contentFilters);

  const handleGetContentList = (setPageNumber: boolean) => {
    const {
      searchText,
      contentTags,
      contentType,
      contentStatus,
      contentCategory,
      createdAt,
      createdBy,
      sortColumn,
      sortDirection,
    } = filters;
    let pageNumber = page;
    const contentCategoryArray = Array.isArray(contentCategory)
      ? `[${contentCategory.join(",")}]`
      : contentCategory;

    if (setPageNumber) {
      pageNumber = 1;
      setCallApi(false);
      setPage(1);
    }
    setApiLoading(true);
    getContentList({
      endpoint: `${API_CONSTANTS.GET_CONTENT_LIST}?page=${pageNumber}&page_size=${rowsPerPage}&query_text=${searchText}&tags=${contentTags}&content_type=${contentType}&created_by=${createdBy}&publish_status=${contentStatus}&created_at=${createdAt}&categories=${contentCategoryArray}&sort_by=${sortColumn}&order=${sortDirection}`,
    })
      .unwrap()
      .then((result) => {
        setContentList(result as ContentDetailsProps);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      })
      .finally(() => {
        setCallApi(true);
        setApiLoading(false);
      });
  };

  useEffect(() => {
    handleGetContentList(true);
  }, [filters]);

  useEffect(() => {
    if (callApi) {
      handleGetContentList(false);
    }
  }, [page, rowsPerPage]);

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleUpdateContentStatus = (
    contentId: string,
    publishStatus: "draft" | "published" | "inactive" | "pending" | "failure",
  ) => {
    updateContentStatus({
      endpoint: API_CONSTANTS.UPDATE_CONTENT_STATUS + contentId + "/status/",
      method: "PUT",
      data: {
        publish_status: publishStatus,
      },
    })
      .unwrap()
      .then((result) => {
        if (result) {
          const { message } = result as UpdateContentStatusSuccessProps;
          dispatch(showToastMessage({ message, severity: "success" }));
          handleGetContentList(false);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  const handleBlockSubmit = (
    organisationIds: number[],
    contentId: string[],
  ) => {
    blockContent({
      endpoint: API_CONSTANTS.POST_CONTENT_BLOCK,
      method: "POST",
      data: {
        content_ids: contentId,
        recipient_id: organisationIds,
      },
    })
      .unwrap()
      .then((result) => {
        if (result) {
          const { message } = result as UpdateContentStatusSuccessProps;
          dispatch(showToastMessage({ message, severity: "success" }));
          handleGetContentList(false);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleDeleteContent = (id: string) => {
    deleteContent({
      endpoint: `${API_CONSTANTS.API_CONTENT}${id}/delete/`,
      method: "DELETE",
    })
      .unwrap()
      .then((result) => {
        if (result) {
          const { message } = result as UpdateContentStatusSuccessProps;
          dispatch(showToastMessage({ message, severity: "success" }));
          handleGetContentList(false);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  return (
    <div className="pt-5.5">
      <PageMetaData title="Content List" />
      <div className="grid grid-cols-5 gap-0">
        <div className="col-span-3">
          <BreadcrumbComponent
            levels={[
              {
                name: "Manage Content",
                path: URL_CONSTANTS.ADMIN_CONTENT_LIST,
                icon: (
                  <MenuBookOutlined className="align-center flex h-4 w-4 text-gray-8" />
                ),
              },
              { name: "Content List" },
            ]}
          />
        </div>
        {checkPermissionExists(
          PERMISSIONS.CONTENT_MANAGEMENT.CREATE,
          permissions,
        ) && (
          <div className="col-start-5 grid justify-items-end">
            <Link href={URL_CONSTANTS.ADMIN_CONTENT_CREATION}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disableRipple
                sx={{ backgroundColor: "primary.main" }}
              >
                New Content
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <ContentListComponent
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          contentList={contentList}
          handleUpdateContentStatus={handleUpdateContentStatus}
          apiLoading={apiLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          handleBlockSubmit={handleBlockSubmit}
          handleDeleteContent={handleDeleteContent}
        />
      </Paper>
      <CheckContentCreatorProfileDialog
        openDialog={checkContentCreatorRes?.is_creator_created === false}
      />
    </div>
  );
};

export default ContentHomePage;
