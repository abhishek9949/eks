import { CategoryList } from "@/types/community";
import { BreadcrumbLevel } from "./breadcrumb";

/** Props for content filter component */
export interface ContentFilterProps {
  categoryList: CategoryList[];
}

/** Props for displaying content list */
export interface ContentListProps {
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  contentList?: ContentDetailsProps | [];
  handleUpdateContentStatus: (
    contentId: string,
    publishStatus: PublishStatus,
  ) => void;
  apiLoading: boolean;
  page: number;
  rowsPerPage: number;
  handleDeleteContent: (contentId: string) => void;
  handleBlockSubmit: (
    organisationIds: number[],
    selectedContent: string[],
  ) => void;
}

/** Individual content properties */
export interface IndividualContentProps {
  _id: string;
  categories: string[];
  content_type: string;
  created_at: string;
  created_by_name: string;
  description: string;
  publish_status: PublishStatus;
  tags: string[];
  title: string;
}

/** Details for content list with pagination */
export interface ContentDetailsProps {
  count: number;
  results: IndividualContentProps[];
}

/** Props for handling content actions */
export interface ContentMoreActionProps {
  openMoreActions: HTMLButtonElement | null;
  handleCloseMoreActions: () => void;
  row: IndividualContentProps | null;
  handleUpdateContentStatus: (
    contentId: string,
    publishStatus: PublishStatus,
  ) => void;
  handleDeleteContent: (contentId: string) => void;
}

/** Success response for updating content status */
export interface UpdateContentStatusSuccessProps {
  message: string;
}

/** Context for managing content-related states */
export interface ContentContextProps {
  page: number;
  rowsPerPage: number;
  searchText: string;
  contentTagsSearchText: string;
  contentTypeSearchText: string;
  contentStatusSearchText: string;
  createdAtSearchText: string;
  createdBySearchText: string;
  contentCategorySearchText: string[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setContentTagsSearchText: React.Dispatch<React.SetStateAction<string>>;
  setContentTypeSearchText: React.Dispatch<React.SetStateAction<string>>;
  setContentStatusSearchText: React.Dispatch<React.SetStateAction<string>>;
  setCreatedAtSearchText: React.Dispatch<React.SetStateAction<string>>;
  setCreatedBySearchText: React.Dispatch<React.SetStateAction<string>>;
  setContentCategorySearchText: React.Dispatch<React.SetStateAction<string[]>>;
}

/** Category structure */
export interface Category {
  name: string;
  color: string;
  category_id: number;
}

/** Initial values for content form */
export interface InitialValues {
  title: string;
  description: string;
  tags: string;
  content_type: string;
  thumbnail_file: File | null;
  file: File | null;
  category: CategoryList[];
  thumbnail_url: string;
  thumbnailType: "file" | null;
  isFileUploaded?: boolean;
  isThumbnailUploaded?: boolean;
}

/** Props for content form */
export interface ContentFormProps {
  initialValues: InitialValues | null;
  onSubmit: (value: InitialValues) => void;
  categoryList: CategoryList[];
}

/** Response structure for fetching content by ID */
export interface GetContentByIdResponse {
  title: string;
  description: string;
  content_type: string;
  tags: string[];
  thumbnail_url: string;
  thumbnail_original_name: string;
  file: {
    url: string;
    format: string;
    size: number;
    height: number;
    width: number;
    duration: null;
    pages: null;
    resolution: string;
  };
  categories: CategoryList[];
}

/** Response type for fetching category list */
export interface UseCategoryListResponse {
  categoryList: CategoryList[];
  loading: boolean;
}

/** Organisation structure */
export interface Organisation {
  organisation_id: string | number;
  organisation_name: string;
}

/** Props for block/unblock dialog */
export interface BlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedOrganizations: Organisation[]) => void;
}

/** Blocked content details */
export interface BlockedContentList {
  categories: CategoryList[];
  title: string;
  organisation_name: {
    blocked_content_id: number;
    organisation_id: number;
    organisation_name: string;
  }[];
  type: string;
  author_name: string;
}

/** Success response for unblocking content */
export interface UnblockContentSuccessProps {
  message: string;
}

export interface ContentFileProps {
  duration: number;
  format: string;
  size: number;
  url: string;
}

export interface CreatedByDetailsType {
  first_name: string;
  last_name: string;
  full_name: string;
  profile_image: string | null;
  email: string;
}

export interface IndividualContentCardProps {
  _id: string;
  author_name: string;
  categories: CategoryList[];
  comment_count: number;
  comments_enabled: boolean;
  content_type: string;
  description: string;
  file: ContentFileProps;
  is_featured: boolean;
  labels: string[];
  tags: string[];
  thumbnail_url: string;
  title: string;
  watch_duration: number;
  created_by_details: CreatedByDetailsType;
}

export interface IndividualContentListResponseProps {
  count: number;
  results: IndividualContentCardProps[];
  next: string;
}

export interface GlobalContentListProps {
  personalized_content: IndividualContentListResponseProps;
  popular_content: IndividualContentListResponseProps;
  recent_content: IndividualContentListResponseProps;
  viewed_content: IndividualContentListResponseProps;
}
/** Enum for content publish status */
export type PublishStatus =
  | "draft"
  | "published"
  | "inactive"
  | "pending"
  | "failure";

export interface GlobalSearchResultProps {
  message: string;
  results: IndividualContentCardProps[];
  next: string;
}

export interface LikeContentResponseProps {
  message: string;
  is_liked: boolean;
  like_count: number;
}

export interface RelatedContentResponseProps {
  message: string;
  results: IndividualContentCardProps[];
}

export interface ContentDetailsRenderPageProps {
  id: string;
  breadcrumbDetails?: BreadcrumbLevel[];
}
