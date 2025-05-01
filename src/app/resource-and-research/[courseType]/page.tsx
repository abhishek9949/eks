"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import CourseCategories from "@/components/ResourceAndResearch/CourseCategories";
import IndividualCourse from "@/components/ResourceAndResearch/IndividualCourse";
import { CourseListProps } from "@/types/course";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useLazyGetIndividualContentListQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { IndividualContentCardProps } from "@/types/content";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import Loader from "@/components/common/Loader";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { getMaximumContentCards } from "@/utils/reusableFunctions";

const CourseListRenderPage = ({ params }: CourseListProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    number | null
  >(Number(searchParams.get("categoryId")) || null);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const contentLoaderRef = useRef<HTMLDivElement | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [getIndividualContentList] = useLazyGetIndividualContentListQuery();
  const [individualContentList, setIndividualContentList] = useState<
    IndividualContentCardProps[]
  >([]);
  const { categoryList, loading } = useCategoryList("content");
  const selectedCategoryId = searchParams.get("categoryId");
  const selectedContentType = searchParams.get("contentType");
  const globalSearchQuery = searchParams.get("search");
  const pageSize = getMaximumContentCards()?.pageSize;

  const getCourseTypeTitle = (title: string) => {
    const titleObject: { [key: string]: { name: string; endpoint?: string } } =
      {
        new: {
          name: CONSTANT_MESSAGE.NEW_COURSES,
          endpoint: API_CONSTANTS.GET_NEW_CONTENT_LIST,
        },
        popular: {
          name: CONSTANT_MESSAGE.POPULAR_COURSES,
          endpoint: API_CONSTANTS.GET_POPULAR_CONTENT_LIST,
        },
        personalised: {
          name: CONSTANT_MESSAGE.PERSONALISED_COURSES,
          endpoint: API_CONSTANTS.GET_PERSONALISED_CONTENT_LIST,
        },
        "continue-watching": {
          name: CONSTANT_MESSAGE.CONTINUE_WATCHING,
          endpoint: API_CONSTANTS.GET_RECENTLY_VIEWED_CONTENT_LIST,
        },
      };
    return titleObject[title];
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

  const handleGetIndividualContentList = (page: number) => {
    if (isApiLoading) return;

    setIsApiLoading(true);

    const endpoint = getCourseTypeTitle(params?.courseType)?.endpoint;
    const queryParams = new URLSearchParams();
    if (selectedCategoryId)
      queryParams.set("content_category", selectedCategoryId);
    if (selectedContentType)
      queryParams.set("content_type", selectedContentType);
    const currentPage = page;
    queryParams.set("page", String(currentPage));
    queryParams.set("page_size", String(pageSize));
    getIndividualContentList({
      endpoint: `${endpoint}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((response) => {
        const newContentData = response?.results || [];
        setIndividualContentList((prev) =>
          mergeUniqueContent(prev, newContentData),
        );
        if (!response?.next) {
          setHasMoreData(false);
        }
        if (response?.results?.length > 0 && response?.next) {
          setPageNo(currentPage + 1);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.error || "Error while fetching content",
            severity: "error",
          }),
        );
      })
      .finally(() => {
        setIsApiLoading(false);
      });
  };

  const resetPaginationData = () => {
    setHasMoreData(true);
    setPageNo(1);
  };

  useEffect(() => {
    if (globalSearchQuery) {
      router.replace(
        `${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/?search=${globalSearchQuery}`,
      );
    } else {
      resetPaginationData();
      setTimeout(() => {
        setIndividualContentList([]);
        handleGetIndividualContentList(1);
      }, 0);
    }
  }, [params?.courseType, searchParams]);

  const handleFilterCategoryList = (filterId: number | null) => {
    setSelectedCategoryFilter(filterId);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isApiLoading && hasMoreData) {
          handleGetIndividualContentList(pageNo);
        }
      },
      { threshold: 1.0 }, // Trigger only when fully visible
    );

    if (contentLoaderRef.current) {
      observer.observe(contentLoaderRef.current);
    }

    return () => {
      if (contentLoaderRef.current) {
        observer.unobserve(contentLoaderRef.current);
      }
    };
  }, [isApiLoading, hasMoreData, pageNo]);

  const breadcrumbLevels = [
    {
      name: "Resource and Research",
      path: URL_CONSTANTS.RESOURCE_AND_RESEARCH,
      icon: (
        <Image
          src="/svg/resourceAndResearch.svg"
          width={22}
          height={22}
          alt="Resource and Research"
        />
      ),
    },
    {
      name: params?.courseType
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    },
  ];

  return (
    <>
      <CourseCategories
        filters={categoryList}
        selectedCategoryFilter={selectedCategoryFilter}
        handleFilterCategoryList={handleFilterCategoryList}
        isCategoriesLoading={loading}
      />
      <div className="mb-3">
        <Breadcrumb levels={breadcrumbLevels} />
        <IndividualCourse
          courses={[
            ...individualContentList,
            ...Array(isApiLoading ? pageSize : 0).fill(null), // Append skeleton placeholders
          ]}
          title={getCourseTypeTitle(params?.courseType)?.name}
          notScrollable
          isDataLoading={isApiLoading}
          contentLoaderRef={contentLoaderRef}
          cardNavigationLink={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/${params?.courseType}`}
        />
      </div>
    </>
  );
};

const CourseList = ({ params }: CourseListProps) => {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<Loader />}>
        <CourseListRenderPage params={params} />
      </Suspense>
    </div>
  );
};

export default CourseList;
