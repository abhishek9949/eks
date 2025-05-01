export interface ReceivedProps {
  endpoint: string;
  method?: string;
  data?: {};
  filter?: Record<string, string | number | boolean>; // filter is optional, and can have string, number, or boolean values
}

export interface DeleteRoleResponseProps {
  message: string;
}

export interface LoginResponseType {
  message: string;
  access_token: string;
}

export interface ForgotPasswordResType {
  message: string;
}

export interface ResetPasswordResType {
  message: string;
}

export interface AcceptInvitationResType {
  message: string;
}

export interface CreateUserResType {
  message: string;
  users: [
    {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      organisation_id: number | null;
    },
  ];
  validation_errors: [];
}

export interface UpdateUserResType {
  message: string;
  data: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    organisation_id: number | null;
  };
}

export interface GetSingleUserResType {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  role_id: number;
  organisation_id: number | null;
}

export interface UpdateUserStatusResType {
  message: string;
}

export interface ReportCommentResType {
  message: string;
}

export interface LikeForumResType {
  message: string;
  is_liked: boolean;
  like_count: number;

  status: number;
  data: {
    error: string;
  };
}

export interface LikeCommentResType {
  message: string;
  is_liked: boolean;
  like_count: number;

  status: number;
  data: {
    error: string;
  };
}

export interface OnboardingAnswersType {
  id: number;
  answer: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  question: number;
}

export interface OnboardingDataType {
  id: number;
  question: string;
  type: string;
  is_other: boolean;
  answers: OnboardingAnswersType[];
}

export interface GetOnboardingQnasResType {
  message: string;
  data: OnboardingDataType[];
}

export interface ReportReasonSingle {
  reason_id: number;
  reason: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  report_count: number | null;
}

export interface ReportReportResType {
  message: string;
  data: ReportReasonSingle[];
}

export interface PostCommunityCommentResType{
  message: string;
  comment_count: number;
}