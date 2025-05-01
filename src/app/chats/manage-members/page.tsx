"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ManageMembersComponent } from "@/components/common/DynamicImports";
import { useSearchParams } from "next/navigation";
import {
  useAddMembersToGroupMutation,
  useLazyGetGroupDetailsByIdQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  AddMembersToGroupDataProps,
  GroupMembersDetailResponse,
  RemoveMembersFromGroupDataProps,
} from "@/types/chats";
import Loader from "@/components/common/Loader";

const ManageMembersHomePage = () => {
  const searchParams = useSearchParams();
  const title = searchParams?.get("title") ?? "";
  const id = searchParams?.get("id") ?? "";
  const createdBy = searchParams?.get("createdBy") ?? "";
  const searchText = searchParams?.get("search") ?? "";
  const [getGroupMembers] = useLazyGetGroupDetailsByIdQuery();
  const [addMembersToGroup] = useAddMembersToGroupMutation();
  const dispatch = useAppDispatch();
  const [membersData, setMembersData] = useState<GroupMembersDetailResponse>();
  const [isMembersDataLoading, setIsMembersDataLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const userId =
    useAppSelector((state) => state.cookies.cookies.userCookies?.user_id) ?? 0;

  const handleGetGroupMembers = useCallback(
    (isFirstPage: boolean) => {
      if (isMembersDataLoading) return;
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
        endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${id}/group_members/?${queryParams?.toString()}`,
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
    [
      getGroupMembers,
      dispatch,
      id,
      searchText,
      isMembersDataLoading,
      page,
      rowsPerPage,
    ],
  );

  const handleAddOrRemoveMembersFromGroup = <
    T extends AddMembersToGroupDataProps | RemoveMembersFromGroupDataProps,
  >(
    method: string,
    data: T,
  ) => {
    addMembersToGroup({
      endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${id}/members`,
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
    if (id) {
      handleGetGroupMembers(true);
    }
  }, [id, searchText]);

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
      {membersData && (
        <ManageMembersComponent
          title={title}
          membersData={membersData}
          isLoading={isMembersDataLoading}
          handleAddOrRemoveMembersFromGroup={handleAddOrRemoveMembersFromGroup}
          createdBy={createdBy}
          page={page}
          rowsPerPage={rowsPerPage}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          userId={userId}
        />
      )}
    </>
  );
};

const ManageMembersWrapper = () => {
  return (
    <div className="flex w-full">
      <Suspense fallback={<Loader />}>
        <ManageMembersHomePage />
      </Suspense>
    </div>
  );
};

export default ManageMembersWrapper;
