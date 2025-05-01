"use client";

import React, { useState, useEffect } from "react";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import {
  useBlockForumCommunityMutation,
  useForumActivateDeactivateMutation,
  useLazyGetForumQuery,
} from "@/redux/allReducer";
import {
  BreadcrumbComponent,
  CommunityListComponent,
} from "@/components/common/DynamicImports";
import { API_CONSTANTS } from "@/constants/api";
import { CommunityTableListApi } from "@/types/community";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import PageMetaData from "@/components/common/PageMetaData";
import useDebounce from "@/hooks/useDebounce";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { setCommunityFilters } from "@/redux/slices/filterSlice";

const CommunityList = () => {
  const [forumList] = useLazyGetForumQuery();
  const [forumActivateDeactivate] = useForumActivateDeactivateMutation();
  const [blockForumCommunity] = useBlockForumCommunityMutation();
  const [data, setData] = useState<CommunityTableListApi | []>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const dispatch = useAppDispatch();
  const filters = useAppSelector(
    (state) => state.filterSlice?.communityFilters,
  );
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  const { communityTitle, searchText, page, rowsPerPage, createdAt, isActive } =
    filters;
  const debouncedSearchText = useDebounce(searchText, 500);
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    dispatch(
      setCommunityFilters({
        page: 1,
      }),
    );
  };

  const handleBlockCommunity = (
    forum_ids: number[],
    organisation_ids: (string | number)[],
  ) => {
    blockForumCommunity({
      endpoint: `${API_CONSTANTS.BLOCK_FORUM_COMMUNITY}`,
      method: "POST",
      data: {
        forum_ids,
        recipient_id: organisation_ids,
      },
    })
      .unwrap()
      .then((blockCommunityRes) => {
        dispatch(
          showToastMessage({
            message: blockCommunityRes?.message,
            severity: "success",
          }),
        );
        getForumList();
      })
      .catch((blockCommunityErr) => {
        dispatch(
          showToastMessage({
            message: blockCommunityErr?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const getForumList = () => {
    setApiLoading(true);
    forumList({
      endpoint: `${API_CONSTANTS.GET_FORUM_LIST}?page=${page}&page_size=${rowsPerPage}&search=${debouncedSearchText || communityTitle}&search_by=topic_title&created_at=${createdAt}&status=${isActive || ""}&sort_by=${sortColumn}&order=${sortDirection}`,
      method: "GET",
    })
      .unwrap()
      .then((responds) => {
        setData(responds?.data as unknown as CommunityTableListApi);
        setApiLoading(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
        setApiLoading(false);
      });
  };

  const handleActivateDeactivateFourm = (forum_id: number, status: string) => {
    forumActivateDeactivate({
      endpoint: `${API_CONSTANTS.FORUM_ACTIVATE_DEACTIVATE_TOGGLE}/${forum_id}/toggle_status/`,
      method: "POST",
      data: {
        status: status,
      },
    })
      .unwrap()
      .then((result) => {
        if (result.message) {
          dispatch(
            showToastMessage({ message: result.message, severity: "success" }),
          );
          getForumList();
        }
      })
      .catch((error) => {
        console.error("Error during deactivation:", error);
        dispatch(
          showToastMessage({
            message: "Error while toggling the community status",
            severity: "error",
          }),
        );
      });
  };

  useEffect(() => {
    getForumList();
  }, [
    communityTitle,
    debouncedSearchText,
    page,
    rowsPerPage,
    createdAt,
    isActive,
    sortColumn,
    sortDirection,
  ]);

  return (
    <div className="pt-5.5">
      <PageMetaData title="Community List" />
      <div className="grid grid-cols-5 gap-0">
        <div className="col-span-3">
          <BreadcrumbComponent
            levels={[
              {
                name: "Manage Community",
                path: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
                icon: (
                  <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
                ),
              },
              { name: "Community List" },
            ]}
          />
        </div>
        {checkPermissionExists(
          PERMISSIONS.COMMUNITY_MANAGEMENT.CREATE,
          permissions,
        ) && (
          <div className="col-start-5  grid justify-items-end">
            <Link href={URL_CONSTANTS.ADMIN_COMMUNITY_CREATION}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                disableRipple
                sx={{ backgroundColor: "primary.main" }}
              >
                New Community
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
        <CommunityListComponent
          forumList={getForumList}
          handleActivateDeactivateFourm={handleActivateDeactivateFourm}
          forumDetails={data}
          loading={apiLoading}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          handleSortChange={handleSortChange}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          handleBlockCommunity={handleBlockCommunity}
        />
      </Paper>
    </div>
  );
};

export default CommunityList;
