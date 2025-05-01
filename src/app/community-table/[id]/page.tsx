"use client";

import React, { useEffect, useState } from "react";
import { PageProps } from "@/types/community";
import Image from "next/image";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  BreadcrumbComponent,
  CommunityTableDetailsComponent,
} from "@/components/common/DynamicImports";
import {
  useLazyGetCommunityCommentsListQuery,
  useLikeForumMutation,
  useReportCommentMutation,
  usePostCommunityCommentMutation,
  usePostCommunityCommentReplyMutation,
  useLazyGetCommunityRepliesListQuery,
  useLikeCommentByIdMutation,
  useLazyGetSingleForumDetailsQuery,
  useLazyGetRelatedCommunityTopicsQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import Loader from "@/components/common/Loader";
import useDebounce from "@/hooks/useDebounce";
import {
  hideOpenReport,
  loadingReportedAction,
  showOpenReport,
  showConfirmReport,
  hideConfirmReport,
} from "@/redux/slices/reportCommentSlice";
import {
  CommentsResData,
  GetSingleForumDetailsResType,
  RelatedTopicsRes,
  ReplyDataType,
} from "@/types/community/CommunityDetails";
import PageMetaData from "@/components/common/PageMetaData";
import { PostCommunityCommentResType } from "@/types/reducer";
import { useSearchParams } from "next/navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

export default function CommunityTableDetailsPage({
  params,
}: Readonly<PageProps>) {
  const { id } = params;
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const myBinsSource = searchParams.get("source") === "mybin";
  const recentBinsSource = searchParams.get("source") === "recents";
  const sharedBinsSource = searchParams.get("source") === "shared-with-me";

  const [getRelatedCommunityTopics] = useLazyGetRelatedCommunityTopicsQuery();
  const [getSingleForumDetails] = useLazyGetSingleForumDetailsQuery();
  const [getCommunityCommentsList] = useLazyGetCommunityCommentsListQuery();
  const [postCommunityComment] = usePostCommunityCommentMutation();
  const [postCommunityCommentReply] = usePostCommunityCommentReplyMutation();
  const [likeForum] = useLikeForumMutation();
  const [getCommunityRepliesList] = useLazyGetCommunityRepliesListQuery();
  const [reportComment] = useReportCommentMutation();
  const [likeCommentById] = useLikeCommentByIdMutation();
  const [singleForumData, setSingleForumData] =
    useState<GetSingleForumDetailsResType>();
  const [apiLoading, setApiLoading] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentsResData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const pageSize = 3;
  const replyPageSize = 3;
  const [searchComment, setSearchComment] = useState("");
  const debouncedSearchComment = useDebounce(searchComment, 500);
  const [repliesList, setRepliesList] = useState<
    Record<number, ReplyDataType[]>
  >({});
  const [hasMoreReplies, setHasMoreReplies] = useState({});
  const [sortComment, setSortComment] = useState<string>("all");
  const [relatedTopicData, setRelatedTopicData] = useState<RelatedTopicsRes>();
  const [isLoadingRelatedData, setIsLoadingRelatedData] =
    useState<boolean>(false);
  const [communityCommentRes, setCommunityCommentRes] =
    useState<PostCommunityCommentResType>();

  const handleSearchComment = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchComment(e.target.value);
    setCurrentPage(1);
    setRepliesList({}); // Reset replies list
    setHasMoreReplies({}); // Reset hasMoreReplies state
  };

  const handleSortComment = (option: string) => {
    setSortComment(option);
    setCurrentPage(1);
    setSearchComment("");
  };

  const handleReportComment = (
    commentId: number,
    reason: { reason_id: number; other_reason?: string },
  ) => {
    dispatch(loadingReportedAction(true));
    reportComment({
      endpoint: `${API_CONSTANTS.REPORT_COMMENT_BY_ID}/${commentId}/report/`,
      method: "POST",
      data: reason,
    })
      .unwrap()
      .then((res) => {
        dispatch(hideOpenReport());
        dispatch(showConfirmReport());
        dispatch(loadingReportedAction(false));
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error reporting the forum",
            severity: "error",
          }),
        );
        dispatch(showOpenReport());
        dispatch(hideConfirmReport());
        dispatch(loadingReportedAction(false));
      });
  };

  const handleCommunityComment = (forumId: number, commentText: string) => {
    postCommunityComment({
      endpoint: `${API_CONSTANTS.POST_COMMUNITY_COMMENT}/${forumId}/create/`,
      method: "POST",
      data: {
        content: commentText,
      },
    })
      .unwrap()
      .then((res) => {
        setCommunityCommentRes(res);
        fetchCommentsList(1, "", "all");
        setCurrentPage(1);
        setSearchComment("");
        setSortComment("all");
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error while commenting",
            severity: "error",
          }),
        );
      });
  };

  const handleCommunityCommentReply = (
    commentId: number,
    replyingId: number,
    commentText: string,
  ) => {
    postCommunityCommentReply({
      endpoint: `${API_CONSTANTS.POST_COMMUNITY_COMMENT_REPLY}/${commentId}/replies/create/`,
      method: "POST",
      data: {
        content: commentText,
        reply_to: replyingId,
      },
    })
      .unwrap()
      .then((res) => {
        setCommunityCommentRes(res);
        fetchRepliesList(commentId, 1);
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error while commenting",
            severity: "error",
          }),
        );
      });
  };

  const fetchForumDetails = () => {
    setApiLoading(true);
    getSingleForumDetails({
      endpoint: `${API_CONSTANTS.GET_FORUM_DETAILS_BY_ID}/${id}`,
    })
      .unwrap()
      .then((res) => {
        setApiLoading(false);
        setSingleForumData(res);
      })
      .catch((err) => {
        setApiLoading(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error retrieving forum",
            severity: "error",
          }),
        );
      });
  };

  const fetchCommentsList = (
    page: number = 1,
    searchComment: string = "",
    sortComment: string = "all",
  ) => {
    getCommunityCommentsList({
      endpoint: `${API_CONSTANTS.GET_COMMUNITY_COMMENTS_LIST}/${id}/comments/?page=${page}&page_size=${pageSize}&sort=${sortComment}&search=${searchComment}`,
    })
      .unwrap()
      .then((res) => {
        setCommentsList((prevComments: CommentsResData[]) => {
          // Only append new comments if it's not the first page
          if (page === 1) {
            return res.results;
          } else {
            return [...prevComments, ...res.results];
          }
        });
        setHasMoreComments(!!res.next); // Set hasMoreComments based on the presence of 'next' in the response
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error retrieving comments",
            severity: "error",
          }),
        );
      });
  };

  const handleLoadMoreComments = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCommentsList(nextPage, debouncedSearchComment, sortComment);
  };

  const fetchRepliesList = (commentId: number, page: number = 0) => {
    getCommunityRepliesList({
      endpoint: `${API_CONSTANTS.GET_COMMUNITY_REPLIES_LIST}/${id}/comments/${commentId}/replies/?reply_page=${page}&reply_page_size=${replyPageSize}`,
    })
      .unwrap()
      .then((res) => {
        setRepliesList((prevReplies) => ({
          ...prevReplies,
          [commentId]:
            page === 1
              ? res.results
              : [...(prevReplies[commentId] || []), ...res.results],
        }));
        if (page > 0) {
          setHasMoreReplies((prevHasMore) => ({
            ...prevHasMore,
            [commentId]: !!res.next,
          }));
        }
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error || "Error retrieving replies",
            severity: "error",
          }),
        );
      });
  };

  const fetchRelatedCommunity = () => {
    setIsLoadingRelatedData(true);
    getRelatedCommunityTopics({
      endpoint: `${API_CONSTANTS.GET_RELATED_COMMUNITY_TOPICS}/${id}`,
    })
      .unwrap()
      .then((relatedCommunityRes) => {
        setRelatedTopicData(relatedCommunityRes);
        setIsLoadingRelatedData(false);
      })
      .catch((relatedCommunityErr) => {
        console.log(relatedCommunityErr);
        setIsLoadingRelatedData(false);
      });
  };

  useEffect(() => {
    fetchForumDetails();
    fetchRelatedCommunity();
  }, [id]);

  useEffect(() => {
    // Fetch comments only once during the initial load
    if (currentPage === 1) {
      fetchCommentsList(currentPage, debouncedSearchComment, sortComment);
    }
  }, [id, currentPage, debouncedSearchComment, sortComment]);

  /**
   * Dynamic breadcrumb chnage for community
   */

  const breadcrumbCommunity = [
    {
      name: "Community Table",
      path: URL_CONSTANTS.COMMUNITY_TABLE,
      icon: (
        <Image
          src="/svg/community-table.svg"
          width={22}
          height={22}
          alt="CommunityTable"
        />
      ),
    },
    { name: singleForumData?.data?.topic_title },
  ];

  const chnageCommunityBreadcrumb = () => {
    let breadcrumbCommunityData = breadcrumbCommunity;
    const binsImg = `<Image width={30} height={30} alt="Bin" src="/svg/Bin.svg" />`;
    if (myBinsSource) {
      const myBinsBreadcrumbData = [
        {
          name: "My Bin",
          path: `${URL_CONSTANTS.BINS}/mybin`,
          icon: (
            <div
              className="align-center flex h-4 w-4 text-gray-breadcrumb"
              dangerouslySetInnerHTML={{ __html: binsImg }}
            ></div>
          ),
        },
        {
          name: singleForumData?.data?.topic_title,
        },
      ];
      breadcrumbCommunityData = myBinsBreadcrumbData;
    } else if (recentBinsSource) {
      const recentBinsBreadcrumbData = [
        {
          name: "Recents",
          path: `${URL_CONSTANTS.BINS}/recents`,
          icon: (
            <AccessTimeIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
          ),
        },
        {
          name: singleForumData?.data?.topic_title,
        },
      ];
      breadcrumbCommunityData = recentBinsBreadcrumbData;
    } else if (sharedBinsSource) {
      const sharedBinsBreadcrumbData = [
        {
          name: "Shared with me",
          path: `${URL_CONSTANTS.BINS}/shared-with-me`,
          icon: (
            <PeopleAltOutlinedIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
          ),
        },
        {
          name: singleForumData?.data?.topic_title,
        },
      ];
      breadcrumbCommunityData = sharedBinsBreadcrumbData;
    }
    return breadcrumbCommunityData;
  };

  return (
    <div className="pt-5.5">
      <PageMetaData
        title={`Community Table | ${singleForumData?.data?.topic_title}`}
      />
      <BreadcrumbComponent levels={chnageCommunityBreadcrumb()} />
      {apiLoading ? (
        <Loader />
      ) : (
        <CommunityTableDetailsComponent
          singleForumData={singleForumData?.data}
          handleReportComment={handleReportComment}
          likeForumPromise={likeForum}
          commentsList={commentsList}
          hasMoreComments={hasMoreComments}
          handleLoadMoreComments={handleLoadMoreComments}
          handleCommunityComment={handleCommunityComment}
          handleCommunityCommentReply={handleCommunityCommentReply}
          handleSearchComment={handleSearchComment}
          fetchRepliesList={fetchRepliesList}
          repliesList={repliesList}
          hasMoreReplies={hasMoreReplies}
          likeCommentByIdPromise={likeCommentById}
          handleSortComment={handleSortComment}
          sortComment={sortComment}
          relatedTopics={relatedTopicData?.related_topics ?? []}
          isLoadingRelatedData={isLoadingRelatedData}
          searchCommentText={debouncedSearchComment}
          communityCommentRes={communityCommentRes?.comment_count as number}
        />
      )}
    </div>
  );
}
