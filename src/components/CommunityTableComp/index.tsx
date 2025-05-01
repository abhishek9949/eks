"use client";

import React from "react";
import CommunityTableCard from "./CommunityTableCards/CommunityTableCard";
import CourseCategories from "@/components/ResourceAndResearch/CourseCategories";
import { timeDifference } from "@/utils/reusableFunctions";
import { CommunityTableCompProps } from "@/types/community";

const CommunityTableComp = (props: CommunityTableCompProps) => {
  const {
    forumData,
    isForumLoading,
    initialLoading,
    likeForumPromise,
    categoryList,
    selectedCategoryFilter,
    handleFilterCategoryList,
    isCategoriesLoading,
  } = props;
  return (
    <div className="grid grid-cols-1">
      {categoryList?.length > 0 && (
        <CourseCategories
          filters={categoryList}
          selectedCategoryFilter={selectedCategoryFilter}
          handleFilterCategoryList={handleFilterCategoryList}
          isCategoriesLoading={isCategoriesLoading}
        />
      )}
      <div className="mt-5">
        {forumData?.map((item) => {
          return (
            <div className="mb-6" key={item.forum_id}>
              <CommunityTableCard
                id={item.forum_id}
                title={item.topic_title}
                desc={item.topic_description}
                avatars={item?.recent_commenters}
                tags={item?.category}
                timeAgo={timeDifference(item?.created_at)}
                commentCount={item?.comment_count}
                likeCount={item?.like_count}
                isLiked={item?.is_liked}
                likeForumPromise={likeForumPromise}
                created_by_details={item?.created_by_details}
              />
            </div>
          );
        })}
        {!initialLoading && forumData.length === 0 && !isForumLoading && (
          <div className="flex items-center justify-center p-20">
            <div className="text-2xl text-black">No Community Data Found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityTableComp;
