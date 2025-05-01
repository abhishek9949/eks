"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { ResourceAndResearchComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import {
  useLazyGetContentGlobalListQuery,
  useLazyResourceAndResearchGlobalSearchQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import {
  GlobalContentListProps,
  IndividualContentCardProps,
  IndividualContentListResponseProps,
} from "@/types/content";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import { getMaximumContentCards } from "@/utils/reusableFunctions";

const ResourceAndResearchHomeRenderPage = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [getContentGlobalList] = useLazyGetContentGlobalListQuery();
  const [resourceAndResearchGlobalSearch] =
    useLazyResourceAndResearchGlobalSearchQuery();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(Number(searchParams.get("categoryId")) || null);
  const [globalSearchContentList, setGlobalSearchContentList] = useState<
    IndividualContentCardProps[]
  >([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isSearchApiLoading, setIsSearchApiLoading] = useState(false);
  const searchLoaderRef = useRef<HTMLDivElement | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [globalContentList, setGlobalContentList] =
    useState<GlobalContentListProps>({
      personalized_content: {} as IndividualContentListResponseProps,
      popular_content: {} as IndividualContentListResponseProps,
      recent_content: {} as IndividualContentListResponseProps,
      viewed_content: {} as IndividualContentListResponseProps,
    });
  const { categoryList, loading } = useCategoryList("content");
  const globalSearchQuery = searchParams.get("search");
  const selectedCategoryId = searchParams.get("categoryId") ?? "";
  const selectedContentType = searchParams.get("contentType") ?? "";
  const pageSize = getMaximumContentCards()?.pageSize;

  const handleGetContentGlobalList = () => {
    setIsApiLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedCategoryId)
      queryParams.set("content_category", selectedCategoryId);
    if (selectedContentType)
      queryParams.set("content_type", selectedContentType);

    getContentGlobalList({
      endpoint: `${API_CONSTANTS.GET_CONTENT_GLOBAL_LIST}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((result) => {
        setGlobalContentList(result as GlobalContentListProps);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.error || "Error while fetching data",
            severity: "error",
          }),
        );
      }).finally(() => {
        setIsApiLoading(false);
      })
  };

  const mergeUniqueContent = (
    prevList: IndividualContentCardProps[],
    newList: IndividualContentCardProps[],
  ) => {
    const combinedData = [...prevList, ...newList];
    return Array.from(
      new Map(combinedData.map((item) => [item._id, item])).values(),
    );
  };

  const handleGlobalSearch = (page: number) => {
    if (isSearchApiLoading) return;
  
    setIsSearchApiLoading(true);
    const queryParams = new URLSearchParams();
    if (selectedCategoryId)
      queryParams.set("content_category", selectedCategoryId);
    if (selectedContentType)
      queryParams.set("content_type", selectedContentType);
    const currentPage = page;
    queryParams.set("page", String(currentPage));
    queryParams.set("per_page", String(pageSize));
    resourceAndResearchGlobalSearch({
      endpoint: `${API_CONSTANTS.RESOURCE_AND_RESEARCH_GLOBAL_SEARCH}${globalSearchQuery}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((result) => {
        const newSearchData = result?.results || [];
        setGlobalSearchContentList((prev) =>
          mergeUniqueContent(prev, newSearchData),
        );
        if (!result?.next) {
          setHasMoreData(false);
        }
        if (result?.results?.length > 0 && result?.next) {
          setPageNo(currentPage + 1);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.error || "Error while searching",
            severity: "error",
          }),
        );
      })
      .finally(() => {
        setIsSearchApiLoading(false);
      });
  };

  const resetPaginationData = () => {
    setGlobalSearchContentList([]);
    setHasMoreData(true);
    setPageNo(1);
  };

  useEffect(() => {
    setGlobalContentList({
      personalized_content: {} as IndividualContentListResponseProps,
      popular_content: {} as IndividualContentListResponseProps,
      recent_content: {} as IndividualContentListResponseProps,
      viewed_content: {} as IndividualContentListResponseProps,
    });
    setGlobalSearchContentList([]);
    if (globalSearchQuery) {
      resetPaginationData();
      setTimeout(() => {
        handleGlobalSearch(1);
      }, 0);
    } else {
      handleGetContentGlobalList();
    }
  }, [searchParams]);

  const handleCategorySelect = (filterId: number | null) => {
    setSelectedCategoryFilter(filterId);
    if (globalSearchQuery) {
      resetPaginationData();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isSearchApiLoading && hasMoreData) {
          handleGlobalSearch(pageNo);
        }
      },
      { threshold: 1.0 }, // Trigger only when fully visible
    );

    if (searchLoaderRef.current) {
      observer.observe(searchLoaderRef.current);
    }

    return () => {
      if (searchLoaderRef.current) {
        observer.unobserve(searchLoaderRef.current);
      }
    };
  }, [isSearchApiLoading, hasMoreData, pageNo]);

  return (
    <>  
      {isApiLoading && <Loader />}
      <PageMetaData title="Resource And Research" />
      <Suspense fallback={<Loader />}>
        <ResourceAndResearchComponent
          globalContentList={globalContentList}
          categoryList={categoryList}
          selectedCategoryFilter={selectedCategoryFilter}
          handleCategorySelect={handleCategorySelect}
          globalSearchContentList={globalSearchContentList}
          globalSearchQuery={globalSearchQuery}
          isApiLoading={isApiLoading}
          isSearchApiLoading={isSearchApiLoading}
          searchLoaderRef={searchLoaderRef}
          isCategoriesLoading={loading}
        />
      </Suspense>
    </>
  );
}

const ResourceAndResearchHome = () => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <ResourceAndResearchHomeRenderPage />
      </Suspense>
    </div>
  )
}

export default ResourceAndResearchHome;
