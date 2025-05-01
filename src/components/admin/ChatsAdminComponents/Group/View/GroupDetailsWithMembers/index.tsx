import React, { useCallback, useEffect, useState } from "react";
import {
  BreadcrumbComponent,
  ManageAdminGroupMembersComponent,
} from "@/components/common/DynamicImports";
import { useSearchParams } from "next/navigation";
import {
  useAddMembersToGroupMutation,
  useLazyGetGroupDetailsByIdQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  AddMembersToGroupDataProps,
  GroupMembersDetailResponse,
  RemoveMembersFromGroupDataProps,
} from "@/types/chats";
import PageMetaData from "@/components/common/PageMetaData";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";

const GroupDetailsWithMembers = ({ groupId }: { groupId: number }) => {
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") ?? "";
  const createdBy = searchParams?.get("createdBy") ?? "";
  const searchText = searchParams?.get("search") ?? "";
  const [getGroupMembers] = useLazyGetGroupDetailsByIdQuery();
  const [addMembersToGroup] = useAddMembersToGroupMutation();
  const dispatch = useAppDispatch();
  const [membersData, setMembersData] = useState<GroupMembersDetailResponse>();
  const [isMembersDataLoading, setIsMembersDataLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleGetGroupMembers = useCallback(
    (isFirstPage: boolean) => {
      setIsMembersDataLoading(true);
      let pageNo = page;
      if (isFirstPage) {
        pageNo = 1;
        setPage(1);
      }
      const queryParams = new URLSearchParams();
      queryParams.set("search", searchText);
      queryParams.set("page", String(pageNo));
      queryParams.set("page_size", String(rowsPerPage));
      getGroupMembers({
        endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${groupId}/group_members/?${queryParams?.toString()}`,
      })
        .unwrap()
        .then((res) => {
          setMembersData(res as GroupMembersDetailResponse);
        })
        .catch((error) => {
          dispatch(
            showToastMessage({
              message: error?.data?.error,
              severity: "error",
            }),
          );
        })
        .finally(() => {
          setIsMembersDataLoading(false);
        });
    },
    [getGroupMembers, dispatch, groupId, searchText],
  );

  const handleAddOrRemoveMembersFromGroup = <
    T extends AddMembersToGroupDataProps | RemoveMembersFromGroupDataProps,
  >(
    method: string,
    data: T,
  ) => {
    addMembersToGroup({
      endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${groupId}/members`,
      method,
      data,
    })
      .unwrap()
      .then((res) => {
        dispatch(
          showToastMessage({
            message: res?.message || "Member(s) added successfully",
            severity: "success",
          }),
        );
        handleGetGroupMembers(true);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    if (groupId) {
      handleGetGroupMembers(true);
    }
  }, [groupId, handleGetGroupMembers, searchText]);

  useEffect(() => {
    handleGetGroupMembers(false);
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

  return (
    <>
      <PageMetaData title="Manage Group" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Manage Group" },
        ]}
      />
      <>
        {membersData && (
          <ManageAdminGroupMembersComponent
            title={title}
            membersData={membersData}
            isLoading={isMembersDataLoading}
            handleAddOrRemoveMembersFromGroup={
              handleAddOrRemoveMembersFromGroup
            }
            createdBy={createdBy}
            page={page}
            rowsPerPage={rowsPerPage}
            handlePageChange={handlePageChange}
            handleRowsPerPageChange={handleRowsPerPageChange}
          />
        )}
      </>
    </>
  );
};

export default GroupDetailsWithMembers;
