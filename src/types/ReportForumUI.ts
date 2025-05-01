export interface SubmitReportFromType {
  reasonId: number;
  otherReason?: string;
}

export interface ReportForumUIPropsType {
  open: boolean;
  handleClose: () => void;
  handleReport: (
    commentId: number,
    reason: { reason_id: number; other_reason?: string },
  ) => void;
  id: number;
}
