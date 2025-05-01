"use client";

import React from "react";
import CommunityTableDetailsWithComment from "./CommunityTableDetailsWithComment";
import IndividualCommunity from "../CommunityTableComp/IndividualCommunity";
import { timeDifference } from "@/utils/reusableFunctions";
import { CommunityTableDetailsProps } from "@/types/community/CommunityDetails";

const CommunityTableDetails = ({
  singleForumData,
  handleReportComment,
  likeForumPromise,
  commentsList,
  handleCommunityComment,
  handleCommunityCommentReply,
  hasMoreComments,
  handleLoadMoreComments,
  handleSearchComment,
  fetchRepliesList,
  repliesList,
  hasMoreReplies,
  likeCommentByIdPromise,
  handleSortComment,
  sortComment,
  relatedTopics,
  isLoadingRelatedData,
  searchCommentText,
  communityCommentRes
}: CommunityTableDetailsProps) => {
  return (
    <>
      <CommunityTableDetailsWithComment
        forumId={singleForumData?.forum_id}
        title={singleForumData?.topic_title}
        desc={singleForumData?.topic_description}
        tags={
          singleForumData?.category?.length
            ? singleForumData.category
            : [
                {
                  category_id: 1000000,
                  name: "Not Available",
                  color: "#000000",
                },
              ]
        }
        timeAgo={
          singleForumData?.created_at
            ? timeDifference(singleForumData.created_at)
            : "Unknown time"
        }
        likeCount={singleForumData?.like_count}
        isLiked={singleForumData?.is_liked}
        commentCount={singleForumData?.comment_count}
        handleReportComment={handleReportComment}
        likeForumPromise={likeForumPromise}
        commentsList={commentsList}
        hasMoreComments={hasMoreComments}
        handleLoadMoreComments={handleLoadMoreComments}
        handleCommunityComment={handleCommunityComment}
        handleCommunityCommentReply={handleCommunityCommentReply}
        handleSearchComment={handleSearchComment}
        fetchRepliesList={fetchRepliesList}
        repliesList={repliesList}
        hasMoreReplies={hasMoreReplies}
        likeCommentByIdPromise={likeCommentByIdPromise}
        handleSortComment={handleSortComment}
        sortComment={sortComment}
        searchCommentText={searchCommentText}
        communityCommentRes={communityCommentRes}
        created_by_details={singleForumData?.created_by_details}
      />
      <div className="mb-10">
        <IndividualCommunity
          communityData={relatedTopics}
          title="Related topic’s"
          notScrollable={false}
          isLoadingRelatedData={isLoadingRelatedData}
        />
      </div>
    </>
  );
};

export default CommunityTableDetails;
