"use client";

import React from "react";
import CourseCategories from "./CourseCategories";
import IndividualCourse from "./IndividualCourse";
// NOSONAR
// import resources from "@/temp/resources.json";
// import FeaturedArticle from "./FeaturedArticle";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { ResourceAndResearchProps } from "@/types/course";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";
import { getMaximumContentCards } from "@/utils/reusableFunctions";

const ResourceAndResearch = ({
  globalContentList,
  categoryList,
  selectedCategoryFilter,
  handleCategorySelect,
  globalSearchContentList,
  globalSearchQuery,
  isApiLoading,
  isSearchApiLoading,
  searchLoaderRef,
  isCategoriesLoading
}: ResourceAndResearchProps) => {
  const params = useSearchParams();
  const {viewed_content, recent_content, popular_content, personalized_content} = globalContentList;
  const pageSize = getMaximumContentCards()?.pageSize;
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
      name: "Search Results",
    },
  ];

  return (
    <>
      <CourseCategories
        filters={categoryList}
        selectedCategoryFilter={selectedCategoryFilter}
        handleFilterCategoryList={handleCategorySelect}
        isCategoriesLoading={isCategoriesLoading}
      />
      {!globalSearchQuery && (
        <div className="my-3">
          {/* NOSONAR */}
          {/* <FeaturedArticle article={resources?.featuredArticle} /> */}
          <div className="flex flex-col">
            {viewed_content?.results?.length > 0 && (
              <IndividualCourse
                courses={viewed_content?.results}
                title={CONSTANT_MESSAGE.CONTINUE_WATCHING}
                navigationLink={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/continue-watching?${params?.toString()}`}
                isDataLoading={isApiLoading}
              />
            )}
            {recent_content?.results?.length > 0 && (
              <IndividualCourse
                courses={recent_content?.results}
                title={CONSTANT_MESSAGE.NEW_COURSES}
                navigationLink={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/new?${params?.toString()}`}
                isDataLoading={isApiLoading}
              />
            )}
            {popular_content?.results?.length > 0 && (
              <IndividualCourse
                courses={popular_content?.results}
                title={CONSTANT_MESSAGE.POPULAR_COURSES}
                navigationLink={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/popular?${params?.toString()}`}
                isDataLoading={isApiLoading}
              />
            )}
            {personalized_content?.results?.length > 0 && (
              <IndividualCourse
                courses={personalized_content?.results}
                title={CONSTANT_MESSAGE.PERSONALISED_COURSES}
                navigationLink={`${URL_CONSTANTS.RESOURCE_AND_RESEARCH}/personalised?${params?.toString()}`}
                isDataLoading={isApiLoading}
              />
            )}
            {viewed_content?.results?.length === 0 && recent_content?.results?.length === 0 && popular_content?.results?.length === 0 && personalized_content?.results?.length === 0 && (
              <div className="flex items-center justify-center p-20">
                <p className="text-2xl text-black">No content found</p>
              </div>
            )}
          </div>
        </div>
      )}
      {globalSearchQuery && (
        <>
          <BreadcrumbComponent levels={breadcrumbLevels} />
          <IndividualCourse
            courses={[
              ...globalSearchContentList,
              ...Array(isSearchApiLoading ? pageSize : 0).fill(null), // Append skeleton placeholders
            ]}
            title="Search Results"
            notScrollable
            isDataLoading={isSearchApiLoading}
            contentLoaderRef={searchLoaderRef}
          />
        </>
      )}
    </>
  );
};

export default ResourceAndResearch;
