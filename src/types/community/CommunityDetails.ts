// Forum Details Type

export interface GetCommunityCategoryType {
  category_id: number;
  name: string;
  color: string;
}

export interface GetSingleForumDetailsData {
  forum_id: number;
  user_id: number;
  user_name: string;
  topic_title: string;
  topic_description: string;
  category: GetCommunityCategoryType[];
  is_premium_only: boolean;
  visibility_boosted: boolean;
  recent_commenters: string[];
  is_liked: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_saved: boolean;
  tags: null;
  status: string;
  moderation_status: string;
  created_at: string;
  updated_at: string;
  created_by_details: CreatedByDetailsTypeForCommunity;
}

export interface GetSingleForumDetailsResType {
  message: "Forum retrieved successfully.";
  data: GetSingleForumDetailsData;
}

// Comments Type

export interface CommentsResData {
  comment_id: number;
  forum: number;
  user_id: number;
  parent_comment: number | null;
  content: string;
  like_count: number;
  report_count: number;
  status: string;
  moderation_status: string;
  created_at: string;
  is_liked: boolean;
  user_name: string;
  replies: {
    count: number;
  };
}

export interface CommentsResType {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommentsResData[];
}

// Reply Type

export interface ReplyDataType {
  comment_id: number;
  forum: number;
  user_id: number;
  parent_comment: number | null;
  reply_to: string;
  content: string;
  like_count: number;
  report_count: number;
  status: string;
  moderation_status: string;
  created_at: string;
  is_liked: boolean;
  user_name: string;
}

export interface ReplyResType {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReplyDataType[];
}

// Community Table Details Props

export interface CommunityTableDetailsProps {
  singleForumData?: GetSingleForumDetailsData;
  handleReportComment: (
    commentId: number,
    reason: { reason_id: number; other_reason?: string },
  ) => void;
  likeForumPromise: (arg: { endpoint: string; method: string }) => Promise<any>;
  commentsList: CommentsResData[];
  hasMoreComments: boolean;
  handleLoadMoreComments: () => void;
  handleCommunityComment: (forumId: number, commentText: string) => void;
  handleCommunityCommentReply: (
    commentId: number,
    replyingId: number,
    commentText: string,
  ) => void;
  handleSearchComment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchRepliesList: (commentId: number, page?: number) => void;
  repliesList: Record<number, ReplyDataType[]>;
  hasMoreReplies: Record<number, boolean>;
  likeCommentByIdPromise: (arg: {
    endpoint: string;
    method: string;
  }) => Promise<any>;
  handleSortComment: (option: string) => void;
  sortComment: string;
  relatedTopics: RelatedTopicsSingleRes[];
  isLoadingRelatedData: boolean;
  searchCommentText: string;
  communityCommentRes: number;
}

// Community Table Details With Comment Props

export interface CreatedByDetailsTypeForCommunity {
  first_name: string;
  last_name: string;
  full_name: string;
  profile_image: string | null;
  email: string;
}

export interface CommunityTableDetailsWithCommentProps {
  forumId?: number;
  title?: string;
  desc?: string;
  tags: GetCommunityCategoryType[];
  timeAgo: string;
  likeCount?: number;
  isLiked?: boolean;
  commentCount?: number;
  handleReportComment: (
    commentId: number,
    reason: { reason_id: number; other_reason?: string },
  ) => void;
  likeForumPromise: (arg: { endpoint: string; method: string }) => Promise<any>;
  commentsList: CommentsResData[];
  hasMoreComments: boolean;
  handleLoadMoreComments: () => void;
  handleCommunityComment: (forumId: number, commentText: string) => void;
  handleCommunityCommentReply: (
    commentId: number,
    replyingId: number,
    commentText: string,
  ) => void;
  handleSearchComment: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fetchRepliesList: (commentId: number, page?: number) => void;
  repliesList: Record<number, ReplyDataType[]>;
  hasMoreReplies: Record<number, boolean>;
  likeCommentByIdPromise: (arg: {
    endpoint: string;
    method: string;
  }) => Promise<any>;
  handleSortComment: (sortOption: string) => void;
  sortComment: string;
  searchCommentText: string;
  communityCommentRes: number;
  created_by_details: CreatedByDetailsTypeForCommunity | undefined;
}

export interface RelatedTopicsSingleRes {
  forum_id: number;
  topic_title: string;
  topic_description: string;
  categories: GetCommunityCategoryType[];
  tags: null;
  created_at: string;
}

export interface RelatedTopicsRes {
  related_topics: RelatedTopicsSingleRes[];
  message: string;
}

export interface IndividualCommunityProps {
  communityData: RelatedTopicsSingleRes[];
  title: string;
  notScrollable: boolean;
  isArrowsVisbale?: boolean;
  isLoadingRelatedData: boolean;
}
