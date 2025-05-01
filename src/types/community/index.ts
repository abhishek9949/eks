import { CreatedByDetailsTypeForCommunity } from "./CommunityDetails";

export interface GetSingleForumResult {
  forum_id: number;
  user_id: number;
  user_name: string;
  topic_title: string;
  topic_description: string;
  category: CategoryList[];
  is_premium_only: boolean;
  visibility_boosted: boolean;
  recent_commenters: string[];
  is_liked: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_saved: boolean;
  tags: string[];
  status: string;
  moderation_status: string;
  created_at: string;
  updated_at: string;
  created_by_details: CreatedByDetailsTypeForCommunity;
  id: number;
}

export interface CommunityTableCompProps {
  forumData: GetSingleForumResult[];
  isForumLoading: boolean;
  initialLoading: boolean;
  likeForumPromise: (arg: { endpoint: string; method: string }) => Promise<any>;
  categoryList: CategoryList[];
  selectedCategoryFilter: number | null;
  handleFilterCategoryList: (filterId: number | null) => void;
  isCategoriesLoading: boolean;
}

export type PageProps = {
  params: {
    id: string;
  };
};
export interface CategoryList {
  category_id: number;
  name: string;
  color: string;
}

export interface CategoryListResponse {
  message: string;
  data: CategoryList[];
}

export type InitialValues = {
  title: string;
  category: number[];
  description: string;
};

export interface ForumResponse {
  topic_title: string;
  category: { id: number; label: string }[];
  topic_description: string;
  is_public: boolean;
}
export interface GetSingleForumResponse {
  data: {
    data: ForumResponse;
  };
}
export interface GetSingleForumResponseData {
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: GetSingleForumResult[] | null;
  };
  error?: string;
}

export type results = {
  forum_id: number;
  user_name: string;
  user_id: number;
  topic_title: string;
  topic_description: string;
  category: CategoryList[];
  is_premium_only: boolean;
  visibility_boosted: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  status: "inactive" | "active" | "deleted";
  moderation_status: string;
  created_at: string;
  updated_at: string;
  count: number;
  next: string | null;
  previous: string | null;
};

export interface GetCommunityTableListApiResponds {
  data: {
    count: number;
    next: string;
    previous: string;
    results: GetSingleForumResult[];
  };
  message: string;
}
export interface CommunityTableListApi {
  count: number;
  next: string;
  previous: string;
  results: GetSingleForumResult[];
}
export interface GetForumListParams {
  page?: number;
  rowsPerPage?: number;
  searchText?: string;
}

export interface CommunityTableListProps {
  forumList: ({ page, rowsPerPage, searchText }: GetForumListParams) => void;
  forumDetails: CommunityTableListApi | [];
  handleActivateDeactivateFourm: (forum_id: number, status: string) => void;
  loading: boolean;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
  selectedRows: GetSingleForumResult[];
  setSelectedRows: React.Dispatch<React.SetStateAction<never[]>>;
  handleBlockCommunity: (
    forum_ids: number[],
    organisation_ids: (string | number)[],
  ) => void;
}

export interface ForumRow {
  forum_id: string;
  topic_title: string;
  user_id: string;
  created_at: string;
  status: boolean;
}

export interface CreateCommunityProps {
  initialValues: ForumResponse;
  onSubmit: any;
  categoryList: CategoryList[];
  isFormSubmitted: boolean;
}
