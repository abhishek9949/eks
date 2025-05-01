export interface SidebarItemProps {
  permission_name: string;
  icon: JSX.Element | null;
  navigation: string;
  subpermissions?: SidebarItemProps[];
  isSideMenuDisplay: boolean;
  isEducator?: boolean;
}

export interface PermissionProps {
  permission_name: string;
  subpermissions?: string[];
}

export interface SidebarNavListComponentProps {
  permissions: SidebarItemProps[];
  selectedPage:string;
  handleMenuClick: ( permissionName: string, permissionType: "parent" | "child") => void;
  routeName: string;
  selectedChild: string;
}