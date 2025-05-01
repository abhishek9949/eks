"use client";

import React, { useEffect, useState } from "react";
import GroupList from "@/components/admin/ChatsAdminComponents/Group/View/GroupList";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import {
  useDeleteGroupMutation,
  useLazyGetAllGroupListQuery,
  useUpdateGroupDetailsMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import useDebounce from "@/hooks/useDebounce";
import {
  GetAllGroupRes,
  GetSingleGroupResultType,
} from "@/types/chatAdminTypes";

const GroupListComponent = () => {
  const dispatch = useAppDispatch();
  const [getAllGroupList] = useLazyGetAllGroupListQuery();
  const [deleteGroup] = useDeleteGroupMutation();
  const [updateGroupDetails] = useUpdateGroupDetailsMutation();
  const [apiLoading, setApiLoading] = useState(false);
  const [groupResObj, setGroupResObj] = useState<GetAllGroupRes>();
  const [groupData, setGroupData] = useState<GetSingleGroupResultType[]>([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const debouncedSearchText = useDebounce(searchText, 500);

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

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    setPage(1);
  };

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleUpdateGroupDetails = (
    groupId: number,
    payload: { group_name: string },
  ) => {
    updateGroupDetails({
      endpoint: `${API_CONSTANTS.UPDATE_GROUP_DETAILS}/${groupId}`,
      method: "PUT",
      data: payload,
    })
      .unwrap()
      .then((updateGroupRes) => {
        dispatch(
          showToastMessage({
            message: updateGroupRes?.message,
            severity: "success",
          }),
        );
        handleGetAllGroupList();
      })
      .catch((updateGroupErr) => {
        dispatch(
          showToastMessage({
            message:
              updateGroupErr?.data?.error || "Error while updating the group",
            severity: "error",
          }),
        );
      });
  };

  const handleDeleteGroup = (id: number) => {
    deleteGroup({
      endpoint: `${API_CONSTANTS.DELETE_GROUP}${id}`,
      method: "DELETE",
      data: {},
    })
      .unwrap()
      .then((deleteGroupRes) => {
        dispatch(
          showToastMessage({
            message: deleteGroupRes?.data?.message,
            severity: "success",
          }),
        );
        handleGetAllGroupList();
      })
      .catch((deleteGroupErr) => {
        dispatch(
          showToastMessage({
            message:
              deleteGroupErr?.message || "Error while deleting the group",
            severity: "error",
          }),
        );
      });
  };

  const handleGetAllGroupList = () => {
    setApiLoading(true);
    getAllGroupList({
      endpoint: `${API_CONSTANTS.GET_ALL_GROUP_LIST}?page=${page}&page_size=${rowsPerPage}&sort_by=${sortColumn}&order=${sortDirection}&query_text=${debouncedSearchText}`,
    })
      .unwrap()
      .then((getGroupRes) => {
        setGroupResObj(getGroupRes);
        const updatedGroupData = getGroupRes?.results?.map((group) => ({
          ...group,
          id: group.group_id,
        }));
        setGroupData(updatedGroupData);
        setApiLoading(false);
      })
      .catch((getGroupErr) => {
        dispatch(
          showToastMessage({
            message: getGroupErr?.data?.error,
            severity: "error",
          }),
        );
        setApiLoading(false);
      });
  };

  useEffect(() => {
    handleGetAllGroupList();
  }, [page, rowsPerPage, sortColumn, sortDirection, debouncedSearchText]);

  return (
    <div className="relative">
      <PageMetaData title="Group List" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Group List" },
        ]}
      />
      <Box className="absolute end-0 top-0 z-1">
        <Link href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_GROUP}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disableRipple
            sx={{ backgroundColor: "primary.main" }}
          >
            New Group
          </Button>
        </Link>
      </Box>
      <GroupList
        isLoading={apiLoading}
        groupResObj={groupResObj}
        groupData={groupData}
        handleDeleteGroup={handleDeleteGroup}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        handleSearchText={handleSearchText}
        searchText={searchText}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSortChange={handleSortChange}
        handleUpdateGroupDetails={handleUpdateGroupDetails}
      />
    </div>
  );
};

export default GroupListComponent;
