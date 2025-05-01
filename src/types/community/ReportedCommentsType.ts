export interface SingleReportedData {
  comment_id: number;
  forum_id: number;
  forum_name: string;
  user_id: number;
  parent_comment: null;
  content: string;
  status: string;
  created_at: string;
  user_name: string;
  reason_id: number;
  reason_text: string;
  other_reasons: string[] | null;
  report_count_by_reason: number;
}

export interface ReportedCommentRes {
  count: number;
  next: string | null;
  previous: string | null;
  results: SingleReportedData[];
}

export interface ReportedCommentsProps {
  reportedCommentsData: SingleReportedData[];
  reportedCommentObj?: ReportedCommentRes | null;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchText: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  page: number;
  rowsPerPage: number;
  handleDeleteReportedComments: (commentIds: number[]) => void;
  handleIgnoreReportedComments: (commentIds: number[]) => void;
  loading: boolean;
  selectedRows: SingleReportedData[];
  setSelectedRows: React.Dispatch<React.SetStateAction<never[]>>;
}

export interface ReportedCommentsMenuProps {
  openReportCommentActionMenu: HTMLElement | null;
  handleCloseReportCommentActionMenu: () => void;
  row: SingleReportedData | null;
  handleDeleteReportedComments: (commentIds: number[]) => void;
  handleIgnoreReportedComments: (commentIds: number[]) => void;
}

export interface OtherReasonMenuProps {
  openOtherReportMenu: HTMLElement | null;
  handleCloseOtherReportMenu: () => void;
  row: SingleReportedData | null;
}

export interface DeleteReporetedCommentsRes {
  message: string;
}

export interface IgnoreReporetedCommentsRes {
  message: string;
}
