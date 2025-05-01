import { OrganisationListProps } from "./organisation";

export const SUBSCRIPTION_FORM_FIELDS = {
  PLAN_NAME: 'plan_name',
  PLAN_TYPE: 'plan_type',
  MONTHLY_PRICE: 'monthly_value',
  ANNUAL_PRICE: 'annually_value',
  NO_OF_LICENSES: 'max_licenses',
  ORGANISATION: 'organisation_id'
} as const;

export interface CreateSubscriptionPlanProps {
  handleSubscriptionPlanSubmit: (values: SubscriptionPlanSubmitProps) => void,
  handleGetOrganisationList: () => void,
  organisationList: OrganisationListProps,
  subscriptionDetails?: IndividualSubscriptionProps,
  isFormSubmitted: boolean,
}

export interface SubscriptionPlanSubmitProps {
  [SUBSCRIPTION_FORM_FIELDS.PLAN_NAME]: string,
  [SUBSCRIPTION_FORM_FIELDS.PLAN_TYPE]: string,
  [SUBSCRIPTION_FORM_FIELDS.MONTHLY_PRICE]: number | null,
  [SUBSCRIPTION_FORM_FIELDS.ANNUAL_PRICE]: number | null,
  [SUBSCRIPTION_FORM_FIELDS.NO_OF_LICENSES]: number | null,
  [SUBSCRIPTION_FORM_FIELDS.ORGANISATION]?: number | null,
}

export interface SubscriptionMoreActionsProps {
  openMoreActions: HTMLButtonElement | null,
  handleCloseMoreActions: () => void,
  row: IndividualSubscriptionProps | null,
  handleDeleteSubscriptionPlan: (planId: number) => void,
  handleChangeSubscriptionPlanStatus: (planId: number, isActive: boolean) => void,
  handlePublishSubscriptionPlan: (planId: number) => void
}

export interface ViewSubscriptionProps {
  subscriptionDetails: SubscriptionDetailsProps | [],
  handleDeleteSubscriptionPlan: (planId: number) => void,
  handleChangeSubscriptionPlanStatus: (planId: number, isActive: boolean) => void,
  page: number
  rowsPerPage: number
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handlePublishSubscriptionPlan: (planId: number) => void,
  loading: boolean;
}

export interface IndividualSubscriptionProps {
  annually_value: number,
  created_at: string,
  currency: string,
  is_active: boolean,
  max_licenses: number,
  max_users: number,
  monthly_value: number,
  organisation_id: number,
  plan_id: number,
  plan_name: string,
  plan_type: string,
  is_published: boolean
}

export interface SubscriptionDetailsProps {
  count: number,
  results: IndividualSubscriptionProps[]
}

export interface EditSubscriptionParamsProps {
  params: {
    id: number
  }
}

export interface ChangeSubscriptionPlanStatusSuccssProps {
  message: string
}

export type GetSubscriptionListProps = (params?: {
  searchText?: string,
  planName?: string,
  planType?: string,
  createdAt?: string,
  planStatus?: string,
  setPageNumber?: boolean,
  sortColumn?: string,
  sortDirection?: string
}) => void;