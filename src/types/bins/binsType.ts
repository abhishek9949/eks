import { IndividualContentCardProps } from "../content";

export interface GetBinsData {
  bin: number;
  bin_id: number;
  shared_with: number[];
  user_id: number;
  bin_name: string;
  bin_color: string;
  is_public: boolean;
  created_by: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string | null;
  };
  updated_by: number;
  created_at: string;
  updated_at: string;
  delete_status: boolean;
  deleted_by: number | null;
}

export interface GetBinsRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    data: GetBinsData[];
  };
}

export interface GetSingleBinRes {
  message: string;
  data: GetBinsData;
}

export interface MyBinsComponentPropType {
  myBinsData: GetBinsData[];
  isBinDataLoading: boolean;
  initialLoading: boolean;
  alignment: string;
  handleUpdateBin?: (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => void;
  handleDeleteBin?: (binId: number) => void;
  handleShareBin?: (binId: number, userIds: number[]) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
}

export interface SingleBinMenuPropType {
  openBinActionMenu: HTMLElement | null;
  handleCloseBinActionMenu: () => void;
  singleBinData: GetBinsData;
  handleUpdateBin?: (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => void;
  handleDeleteBin?: (binId: number) => void;
  handleShareBin?: (binId: number, userIds: number[]) => void;
}

export interface CreateBinFormPropType {
  openCreateBinDialog: boolean;
  handleCloseCreateBin: () => void;
  handleCreateBin?: (payload: { bin_name: string; bin_color: string }) => void;
  binId?: number;
  handleUpdateBin?: (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => void;
}

export interface SingleBinPropType {
  color: string;
  name: string;
  bin_id?: number;
  singleBinData: GetBinsData;
  handleUpdateBin?: (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => void;
  handleDeleteBin?: (binId: number) => void;
  redirectBinLink: string;
  handleShareBin?: (binId: number, userIds: number[]) => void;
}

export interface ToggleBtnGridListPropType {
  alignment: string;
  handleChangeAlignment: (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => void;
}

export interface UpdateBinRes {
  message: string;
  data: GetBinsData;
}

export interface CreateBinRes {
  message: string;
  data: GetBinsData;
}

export interface BinCommunityCardPropType {
  forum_id: number | string;
  topic_title: string;
  topic_description: string;
  category: [
    {
      name: string;
      color: string;
      category_id: number;
    },
  ];
}

export interface ContentMetadataType {
  _id: string;
  file: {
    duration: number;
  };
  title: string;
  categories: [
    {
      name: string;
      color: string;
      category_id: number;
    },
  ];
  description: string;
  content_type: string;
  thumbnail_url: string;
  watch_duration: number | null;
}

export interface CommunityMetadataType {
  category: [
    {
      name: string;
      color: string;
      category_id: number;
    },
  ];
  forum_id: number;
  topic_title: string;
  topic_description: string;
}

export interface GetContentFromBinData {
  bin_content_id: number;
  content_id: string;
  content_type: string;
  metadata: ContentMetadataType | CommunityMetadataType;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  delete_status: boolean;
  deleted_by: null;
  bin: number;
}

export interface GetContentFromBinRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    data: GetContentFromBinData[];
    bin_name: string;
  };
}

export interface MyBinContentsPropType {
  binContentData: GetContentFromBinData[];
  isBinDataLoading: boolean;
  initialLoading: boolean;
  alignment: string;
  handleRemoveBinContent: (contentId: number | string) => void;
  breadcrumbSource: () => void;
}

export interface BinContentMenuPropType {
  openBinContentAction: HTMLElement | null;
  handleCloseBinContentAction: () => void;
  id: string | number;
  title: string;
  handleRemoveBinContent: (contentId: number | string) => void;
}

export interface BinContentCardPropType {
  course: IndividualContentCardProps;
  cardNavigationLink?: string;
  handleRemoveBinContent: (contentId: number | string) => void;
  created_by_id: number;
  breadcrumbSource: () => void;
}

export interface SharedBinSingleData {
  bin_share_id: number;
  shared_with: number;
  bin_name: string;
  bin_color: string;
  shared_by: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string | null;
  };
  shared_with_org: boolean;
  permission: string;
  status: string;
  created_by: {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    profile_image: string | null;
  };
  updated_by: number;
  created_at: string;
  updated_at: string;
  delete_status: boolean;
  deleted_by: number | null;
  bin: number;
}

export interface SharedBinRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    message: string;
    data: SharedBinSingleData[];
  };
}

export interface ShareWitMeComponentPropType {
  myBinsData: SharedBinSingleData[];
  isBinDataLoading: boolean;
  initialLoading: boolean;
  alignment: string;
  handleUpdateBin?: (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => void;
  handleDeleteBin?: (binId: number) => void;
  handleShareBin?: (binId: number, userIds: number[]) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
}
