export interface Route {
  icon: string;
  label: string;
  route: string;
}

export interface SubPermission {
  permission_name: string;
  route: Route;
}

export interface PermissionsState {
  permission_name: string;
  navigation: Route[];
  subpermissions: SubPermission[];
  role_name: string;
  permissions: string[];
}

export interface Roles {
  role_id: number;
  role_name: string;
}

export interface UserInfo {
  full_name: string;
  id: number;
  profile: string;
  email: string;
}

export interface Role {
  role: Roles;
  permissions: PermissionsState[];
  user_info: UserInfo;
  token: string;
}

export interface AuthState {
  token: string;
  roles: Role[];
  selected_role: Role | null;
}

export const initialState: AuthState = {
  token: "",
  roles: [],
  selected_role: null,
};
export interface AccountDataProps {
  email: string;
  full_name: string;
  profile: string;
  token: string;
  isActiveAccount: boolean;
  unique_id: string;
}

export interface CookieDataProps {
  accountData: Role;
  currentAccount: AccountDataProps[];
  accessToken: string;
  uniqueId: string;
}
