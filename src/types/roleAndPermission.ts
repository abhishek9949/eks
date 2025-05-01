export interface ChildPermissionProps {
  permission_id: number,
  parent_id: number,
  permission_name: string,
  description?: string
}

export interface PermissionProps {
  permission_id: number,
  parent_id: number,
  permission_name: string,
  icon?: string,
  description?: string,
  sub_permissions: ChildPermissionProps[]
}

export interface RoleProps {
  role_id: number,
  role_name: string,
  description?: string,
  created_at: string,
  updated_at: string,
  created_by: number
}

export interface RoleDetailsProps {
  count: number,
  results: RoleProps[]
}

export interface ViewRoleProps {
  roleDetails: RoleDetailsProps | [],
  handleDeleteRole: (roleId: number) => void,
  page: number,
  rowsPerPage: number,
  handlePageChange: (event: React.MouseEvent | null, newPage: number) => void
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  loading: boolean;
}

export interface CreateRoleSubmitProps {
  roleName: string,
  roleDescription: string,
  selectedPermissions: number[]
}
export interface CreateRoleProps {
  permissions: PermissionProps[],
  handleRoleSubmit: ({ roleName, roleDescription, selectedPermissions }: CreateRoleSubmitProps) => void
  roleId?: number,
  roleDetails?: CreateRoleSubmitProps,
  isFormSubmitted: boolean,
}

export interface EditRoleParamsProps {
  params: {
    id: number
  }
}

export interface GetRoleDetailsProps {
  role_name: string,
  description: string,
  permissions: ChildPermissionProps[]
}

export interface RoleMenuProps {
  roleMoreActions: HTMLElement | null,
  handleCloseRoleActionsMenu: () => void,
  row: RoleProps | null,
  handleDeleteRole: (roleId: number) => void
}
