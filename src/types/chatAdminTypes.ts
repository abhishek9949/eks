import { FormikHelpers } from "formik";
import { GlobalUsersList } from "@/types/user";

export interface CreateChannelInitialValueType {
  channel_name: string;
  channel_description: string;
  is_public: boolean;
}

export interface CreateChannelResType {
  message: string;
}

export interface CreateChannelFormPropType {
  initialValues: CreateChannelInitialValueType;
  onSubmit: (
    values: CreateChannelInitialValueType,
    formikHelpers: FormikHelpers<CreateChannelInitialValueType>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
}

export interface ChannelListType {
  id: number;
  channel_id: number;
  channel_name: string;
  created_by: number;
  updated_by: string | number | null;
  organization_id: number | null;
  is_public: boolean;
  is_blocked: boolean;
  description: string;
  restricted_role: [];
  delete_status: string;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ChannelListResType {
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ChannelListType[];
  };
}

export interface ChannelListPropsType {
  isLoading: boolean;
  channelsResObj?: ChannelListResType;
  channelsData: ChannelListType[];
  handleDeleteChannel: (id: number) => void;
  selectedRows: ChannelListType[];
  setSelectedRows: React.Dispatch<React.SetStateAction<never[]>>;
  handleBlockChannel: (
    channel_ids: number[],
    organisation_ids: (string | number)[],
  ) => void;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  handleSearchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  sortColumn: string;
  sortDirection: false | "asc" | "desc" | undefined;
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
}

export interface ChannelMenuPropType {
  openChannelMenu: HTMLElement | null;
  handleCloseChannelActionMenu: () => void;
  row: ChannelListType;
  handleDeleteChannel: (id: number) => void;
}

export interface SingleChannelResType {
  message: string;
  data: ChannelListType;
}

export interface BlockedChannelOrgData {
  blocked_channel_id: number;
  organisation_name: string;
  organisation_id: number;
}
export interface BlockedChannelListType {
  channel_id: string;
  status: string;
  organisation_name: BlockedChannelOrgData[];
  channel_name: string;
}

export interface BlockedChannelResultsType {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlockedChannelListType[];
}

export interface BlockedChannelListResType {
  data: BlockedChannelResultsType;
  message: string;
}

export interface SingleBlockedChannelPropType {
  channel_name: string;
  items: BlockedChannelOrgData[];
  onSelect: React.Dispatch<React.SetStateAction<number[]>>;
  selectedItems: number[];
  handleSelectAll: (items: BlockedChannelOrgData[]) => void;
}

export interface CreateGroupInitailValues {
  groupName: string;
  peopleSelected: GlobalUsersList[];
  is_public: boolean;
}

export interface CreateGroupFormProps {
  handleCreateGroup: (values: CreateGroupInitailValues) => void;
  isFormSubmitted: boolean;
}
export interface GetSingleGroupResultType {
  id: number;
  group_id: number;
  group_name: string;
  created_by: string;
  updated_by: string | null;
  organization_id: number;
  is_blocked: boolean;
  description: string;
  is_public: boolean;
  type: string;
  restricted_role: number[];
  delete_status: string;
  deleted_by: number | null;
  latest_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetAllGroupRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: GetSingleGroupResultType[];
}

export interface GroupMenuPropType {
  openGroupMenu: HTMLElement | null;
  handleCloseGroupActionMenu: () => void;
  row: GetSingleGroupResultType;
  handleDeleteGroup: (id: number) => void;
  handleUpdateGroupDetails: (
    groupId: number,
    payload: { group_name: string },
  ) => void;
}

export interface GroupListPropsType {
  isLoading: boolean;
  groupResObj?: GetAllGroupRes;
  groupData: GetSingleGroupResultType[];
  handleDeleteGroup: (id: number) => void;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  page: number;
  rowsPerPage: number;
  handleSearchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  sortColumn: string;
  sortDirection: false | "asc" | "desc" | undefined;
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
  handleUpdateGroupDetails: (
    groupId: number,
    payload: { group_name: string },
  ) => void;
}

export interface RenameGroupTypes {
  openRenameGroupDialog: boolean;
  handleCloseRenameGroup: () => void;
  groupId: number;
  handleUpdateGroup: (groupId: number, payload: { group_name: string }) => void;
}
