"use client";

import React, { useEffect, useState } from "react";
import { CommunityTableComponent } from "@/components/common/DynamicImports";
import { useLazyGetForumQuery, useLikeForumMutation } from "@/redux/allReducer";
import { useAppDispatch } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useCategoryList } from "@/hooks/useCategoryList";
import { GetSingleForumResult } from "@/types/community";
import PageMetaData from "@/components/common/PageMetaData";
import { Pagination, Stack } from "@mui/material";
import Loader from "@/components/common/Loader";

export default function CommunityTablePage() {
  const { categoryList, loading } = useCategoryList("community");

  const dispatch = useAppDispatch();
  const [getForum] = useLazyGetForumQuery();
  const [likeForum] = useLikeForumMutation();
  const [forumData, setForumData] = useState<GetSingleForumResult[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(null);

  const handleFilterCategoryList = (filterId: number | null) => {
    setSelectedCategoryFilter(filterId);
    setPage(1);
    setInitialLoading(true);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const fetchForumData = async () => {
    setApiLoading(true);
    try {
      const response = await getForum({
        endpoint: `${API_CONSTANTS.GET_FORUM_LIST}?page=${page}&page_size=5&category=${selectedCategoryFilter}&status=active&moderation_status=approved&q=${""}`,
        method: "GET",
      }).unwrap();

      const newForumData = response?.data?.results || [];
      setForumData(newForumData);
      setPageCount(Math.ceil(response?.data?.count / 5));
      setApiLoading(false);
    } catch (error: any) {
      dispatch(
        showToastMessage({
          message: error?.data?.error || "Error fetching data",
          severity: "error",
        }),
      );
      setApiLoading(false);
    } finally {
      setApiLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchForumData();
  }, [page, selectedCategoryFilter]);

  return (
    <div className="pb-15">
      <PageMetaData title="Community Table" />
      <div className="min-h-[80vh]">
        {apiLoading ? (
          <Loader />
        ) : (
          <CommunityTableComponent
            forumData={forumData}
            isForumLoading={apiLoading}
            initialLoading={initialLoading}
            likeForumPromise={likeForum}
            categoryList={categoryList}
            selectedCategoryFilter={selectedCategoryFilter}
            handleFilterCategoryList={handleFilterCategoryList}
            isCategoriesLoading={loading}
          />
        )}
      </div>

      <Stack spacing={2} className="my-5 flex items-end">
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          size="large"
          color="primary"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
