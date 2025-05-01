export interface BlockedCommunityOrgData {
  blocked_community_id: number;
  organisation_name: string;
  organisation_id: number;
}
export interface BlockedCommunityListType {
  community_id: string;
  status: string;
  organisation_name: BlockedCommunityOrgData[];
  community_title: string;
}

export interface BlockedCommunityResultsType {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlockedCommunityListType[];
}

export interface BlockedCommunityListResType {
  data: BlockedCommunityResultsType;
  message: string;
}

export interface SingleBlockedCommunityPropType {
  community_title: string;
  items: BlockedCommunityOrgData[];
  onSelect: React.Dispatch<React.SetStateAction<number[]>>;
  selectedItems: number[];
  handleSelectAll: (items: BlockedCommunityOrgData[]) => void;
}
