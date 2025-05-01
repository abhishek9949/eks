import { GlobalUsersList } from "./user";

export const InitialGroupDetailsValues = {
  created_by: 0,
  group_id: 0,
  group_name: "",
  is_blocked: false,
  is_public: false,
  members: 0,
  organization_id: 0,
};

export const InitialSenderValues = {
  email: "",
  first_name: "",
  last_name: "",
  profile_image: "",
  user_id: 0,
};

export const InitialChatHistoryDataValues = [
  {
    ably_channel: 0,
    is_read: false,
    message: "",
    message_id: 0,
    message_status: "",
    message_type: "",
    parent_id: 0,
    recipient: InitialSenderValues,
    sender: InitialSenderValues,
    type: "",
    unique_id: "",
    unread_count: 0,
  },
];

export const InitialChatHistoryValues = {
  count: 0,
  next: "",
  previous: "",
  results: InitialChatHistoryDataValues,
};

export const InitialRecentMessagesDataValues = [
  {
    ably_channel: 0,
    is_read: false,
    message: "",
    message_id: 0,
    message_status: "",
    message_type: "",
    parent_id: 0,
    recipient: InitialSenderValues,
    sender: InitialSenderValues,
    type: "",
    unique_id: "",
    unread_count: 0,
    group_name: "",
    group_id: 0,
    group_message_id: 0,
    channel_name: "",
    channel_id: 0,
    updated_at: "",
    created_by: InitialSenderValues,
    created_at: ""
  },
];

export const InitialRecentMessagesValues = {
  count: 0,
  next: "",
  previous: "",
  results: {
    data: InitialRecentMessagesDataValues,
    message: "",
  },
};

export const InitialGlobalChatHistoryDataValues = {
  channel_chats: InitialRecentMessagesDataValues,
  group_chats: InitialRecentMessagesDataValues,
  private_chats: InitialRecentMessagesDataValues,
};

export const IndividualAccordionInitialValues = {
  ably_channel: 0,
  is_read: false,
  message: "",
  message_id: 0,
  message_status: "",
  message_type: "",
  parent_id: 0,
  recipient: InitialSenderValues,
  sender: InitialSenderValues,
  type: "",
  unique_id: "",
  unread_count: 0,
  group_name: "",
  group_id: 0,
  group_message_id: 0,
  channel_name: "",
  channel_id: 0,
  updated_at: "",
  created_by: InitialSenderValues,
  created_at: ""
};

const mockSenderValues = {
  email: "",
  first_name: "Test",
  last_name: "User",
  profile_image: "",
  user_id: 1,
};

const mockRecipientValues = {
  email: "",
  first_name: "Test 1",
  last_name: "User",
  profile_image: "",
  user_id: 123,
};

export const mockGroupData = {
  ably_channel: 0,
  is_read: false,
  message: "Hello",
  message_id: 1,
  message_status: "",
  message_type: "text",
  parent_id: 0,
  recipient: mockRecipientValues,
  sender: mockSenderValues,
  type: "private",
  unique_id: "",
  unread_count: 0,
  group_name: "Group chat",
  group_id: 123,
  channel_name: "",
  channel_id: 0,
  updated_at: "",
  created_by: mockSenderValues,
  group_message_id: 0,
  created_at: ""
};

export interface SenderProps {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  user_id: number;
}

export interface IndividualAccordionDetailsProps {
  ably_channel: number;
  is_read: boolean;
  message: string;
  message_id: number;
  message_status: string;
  message_type: string;
  parent_id: number;
  recipient: SenderProps;
  sender: SenderProps;
  type: string;
  unique_id: string;
  unread_count: number;
  group_name: string;
  group_id: number;
  group_message_id: number;
  channel_name: string;
  channel_id: number;
  updated_at: string;
  created_by: SenderProps;
  created_at: string;
}

export interface IndividualAccordionProps {
  title: string;
  details: IndividualAccordionDetailsProps[];
  type: string;
  handleClearGroupChat?: (groupId: number) => void;
  userId: number;
  handleDeleteGroup?: (groupId: number) => void;
  isGlobalChatHistoryLoading: boolean;
  toggleSidebar: () => void;
}

export interface NewGroupPopupProps {
  openNewGroupPopup: boolean;
  handleCloseNewGroupPopup: () => void;
  handleCreateGroup: (values: CreateGroupValuesProps) => void;
}

export interface NewChatPopupProps {
  handleOnClickCreateGroup: () => void;
  getSearchGlobalChatDetails: (searchText: string) => void;
  searchedGlobalChatDetailsResult: SearchedGlobalChatDetailsResponse[];
  toggleNewChatPopup: () => void;
  isSearchGlobalChatDetailLoading: boolean;
  userId: number;
}

export interface AccessSettingsConstantsProps {
  title: string;
  icon: JSX.Element;
}

export interface IndividualFilterProps {
  id: number;
  title: string;
}
export interface FilterCommonRadioProps {
  filter: IndividualFilterProps;
  selectedFilter: string;
  onFilterChange: () => void;
  key: number;
}

export interface GroupChatHeaderProps {
  groupDetails: GroupDetailsByIdData;
  handleDeleteGroup: (groupId: number) => void;
  handleLeaveGroup: (groupId: number) => void;
  userId: number;
}

export interface IndividualMessageComponentProps {
  message: IndividualMessageProps;
  userId: number;
  setIsReplyMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<IndividualMessageProps | undefined>
  >;
  handleDeleteMessage: (messageId: string) => void;
  messageType: string;
}

export interface AddMembersToGroupDataProps {
  add_members: number[];
}

export interface RemoveMembersFromGroupDataProps {
  remove_members: number[];
}

export interface ManageMembersProps {
  title: string;
  membersData: GroupMembersDetailResponse;
  isLoading: boolean;
  handleAddOrRemoveMembersFromGroup: <
    T extends AddMembersToGroupDataProps | RemoveMembersFromGroupDataProps,
  >(
    method: string,
    data: T,
  ) => void;
  createdBy: string;
  page: number;
  rowsPerPage: number;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  userId?: number
}

export interface AddMemberToGroupPopupProps {
  isAddMemberPopupOpen: boolean;
  handleCloseAddMemberPopup: () => void;
  handleAddMembersToGroup: <
    T extends AddMembersToGroupDataProps | RemoveMembersFromGroupDataProps,
  >(
    method: string,
    data: T,
  ) => void;
}

export interface MemberMoreActionsProps {
  openMemberMoreActions: HTMLButtonElement | null;
  handleCloseMemberMoreActions: () => void;
}

export interface GroupMoreActionsProps {
  openGroupMoreActions: HTMLButtonElement | null;
  handleCloseGroupMoreActions: () => void;
  handleClearGroupChat?: (groupId: number) => void;
  currentRow: IndividualAccordionDetailsProps;
  userId: number;
  handleDeleteGroup?: (groupId: number) => void;
}

export interface GroupDetailsByIdData {
  created_by: number;
  group_id: number;
  group_name: string;
  is_blocked: boolean;
  is_public: boolean;
  members: number;
  organization_id: number;
}
export interface GroupDetailsByIdResponse {
  data: GroupDetailsByIdData;
  message: string;
}

export interface IndividualGroupMemberData {
  email: string;
  group_id: number;
  group_member_id: number;
  profile: string;
  role: string;
  user_id: number;
  user_name: string;
}

export interface GroupMembersDetailData {
  count: number;
  next: string;
  previous: string;
  results: IndividualGroupMemberData[];
}

export interface GroupMembersDetailResponse {
  data: GroupMembersDetailData;
  message: string;
  total_members: number;
}

export interface MessageComponentProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  ablyChannelId: string;
  groupDetails: GroupDetailsByIdData;
  handleDeleteGroup: (groupId: number) => void;
  handleLeaveGroup: (groupId: number) => void;
  userId: number;
  messages: IndividualMessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<IndividualMessageProps[]>>;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  handleScroll: () => void;
  isReplyMessage: boolean;
  setIsReplyMessage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMessage: IndividualMessageProps | undefined;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<IndividualMessageProps | undefined>
  >;
  handleDeleteMessage: (messageId: string) => void;
  profileImage: string;
}

export interface ChatFilterProps {
  handleCloseFilter: () => void;
}

export interface SearchedGlobalChatDetailsResponse {
  chat_type: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  profile_image: string;
  username: string;
  group_id: number;
  group_name: string;
  channel_id: number;
  channel_name: string;
}

export interface CreateGroupValuesProps {
  groupName: string;
  peopleSelected: GlobalUsersList[];
  accessSettings: string;
}

export interface IndividualMessageProps {
  id: number | string;
  text: string;
  sender: {
    id: number;
    name: string;
    profile_image: string;
  };
  timestamp: string | number;
  uniqueId: string;
  parent_id?: number | string;
  isError?: boolean;
  parent_message?: string;
  status?: string;
  isDeleted?: boolean;
  type: string;
}

export interface ChatSliceProps {
  isChatCleared: boolean;
  reloadChatHistory: boolean;
}

export interface SendMessageProps {
  ably_channel_id: string;
  message: string;
  message_id: number;
  success: boolean;
}

export interface ChatHistoryDataProps {
  ably_channel: number;
  ably_channel_name: string;
  is_read: boolean;
  message: string;
  message_id: number;
  message_status: string;
  message_type: string;
  parent_id: number;
  recipient: SenderProps;
  sender: SenderProps;
  type: string;
  unique_id: string;
  unread_count: number;
}

export interface ChatHistoryProps {
  count: number;
  next: string;
  previous: string;
  results: ChatHistoryDataProps[];
  user_profile_image: string;
}

export interface AddMembersToGroupProps {
  message: string;
}

export interface RecentMessagesResponseProps {
  count: number;
  previous: string;
  next: string;
  results: {
    data: IndividualAccordionDetailsProps[];
    message: string;
  };
}

export interface DisplayMessagesProps {
  ablyChannelId: string;
  messages: IndividualMessageProps[];
  setMessages: React.Dispatch<React.SetStateAction<IndividualMessageProps[]>>;
  setIsReplyMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMessage: React.Dispatch<
    React.SetStateAction<IndividualMessageProps | undefined>
  >;
  handleDeleteMessage: (messageId: string) => void;
  messageType: string;
}
export interface GlobalChatHistoryDataProps {
  channel_chats: IndividualAccordionDetailsProps[];
  group_chats: IndividualAccordionDetailsProps[];
  private_chats: IndividualAccordionDetailsProps[];
}

export interface GlobalChatHistoryResponseProps {
  data: GlobalChatHistoryDataProps;
  message: string;
}

export interface ChatDefaultScreenProps {
  text: string;
  description: string;
}

export interface CreateGroupResponseProps {
  group_id: number;
  message: string;
}

export interface DeleteGroupResponseProps {
  data: {
    message: string;
  };
}

export interface ChatHomePageProps {
  userId: number;
}

export interface MessageSearchResultsProps {
  searchResults: IndividualAccordionDetailsProps[];
  userId: number;
  searchResultsCount: number;
  contentLoaderRef: React.RefObject<HTMLDivElement>;
  isSearchMessageLoading: boolean;
  messageType: string;
  recipientId: string
}

export interface MessageSearchResponseProps {
  count: number;
  next: string;
  results: IndividualAccordionDetailsProps[];
}

export interface MessageEditComponentProps {
  updatedMessage: string;
  setUpdatedMessage: React.Dispatch<React.SetStateAction<string>>;
  editMessageRef: React.RefObject<HTMLInputElement>;
  setIsMessageEdit: React.Dispatch<React.SetStateAction<boolean>>;
  message: IndividualMessageProps;
}

export interface ReplyOrNormalMessageComponentProps {
  isSelf: boolean;
  message: IndividualMessageProps;
  individualMessageMoreActions: HTMLButtonElement | null;
  setIndividualMessageMoreActions: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  messageType: string;
}

export interface ChatIconComponentProps {
  type: string;
  width: number;
  isChatPopup?: boolean;
  isAccordion?: boolean;
  src?: string;
  name?: string;
}

export interface ChatMainComponentProps {
  setSidebarOpen: (value: boolean) => void;
}