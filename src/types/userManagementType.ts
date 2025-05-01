import { FormikHelpers } from "formik";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface UserDetailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserType[];
}

export interface UserType {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
  roles: string[];
  invite_status: "Pending" | "Accepted" | "Expired"
  role_id: number;
}


export interface OrgAdminListProps {
  userData: UserDetailsResponse | [];
  updateUserStatus: (args: any) => Promise<any>;
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchText: string;
  page: number;
  rowsPerPage: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  handleSortChange: (column: string, direction: "asc" | "desc") => void;
  handleUpdateUserStatus: (id: number, status: boolean) => void;
  handleOpenFilter: () => void;
  openFilter: boolean;
  loading: boolean;
  handleResendUserInvitation: (id: number) => void;
}

export interface UserMenuType {
  openUserActionMenu: HTMLElement | null;
  handleCloseUserActionMenu: () => void;
  row: UserType;
  handleUpdateUserStatus: (id: number, status: boolean) => void;
  handleResendUserInvitation: (id: number) => void;
}

// Create User Types

export interface CreateUserValues {
  firstname: string;
  lastname: string;
  email: string;
  role_id: number | null;
  organisation_id: number | null | undefined;
}

export type UserFormProps = {
  initialValues: CreateUserValues;
  onSubmit: (
    values: CreateUserValues,
    formikHelpers: FormikHelpers<CreateUserValues>,
  ) => void | Promise<void>;
  isFormSubmitted: boolean;
};

export interface EditUserParams {
  params: {
    id: string;
  };
}
