'use client';
import React, { useEffect, useState } from "react";
import { useCreateRoleMutation, useLazyGetPermissionsQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { CreateRoleSubmitProps, PermissionProps } from "@/types/roleAndPermission";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import { BreadcrumbComponent, CreateRoleComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";

export default function CreateRoleHomePage() {
  const [getPermissions] = useLazyGetPermissionsQuery();
  const [createRole] = useCreateRoleMutation();
  const [permissions, setPermissions] = useState<PermissionProps[]>([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    getPermissions({
      endpoint: API_CONSTANTS.GET_PERMISSIONS
    }).unwrap().then((result) => {
      setPermissions(result as PermissionProps[])
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  }, []);

  const handleRoleCreate = ({ roleName, roleDescription, selectedPermissions }: CreateRoleSubmitProps) => {
    setIsFormSubmitted(true);
    const permissions = selectedPermissions.map((permission) => ({id: permission}))
    createRole({
      endpoint: API_CONSTANTS.CREATE_ROLE,
      method: 'POST',
      data: {
        role_name: roleName,
        description: roleDescription,
        permissions
      }
    }).unwrap().then(() => {
      dispatch(showToastMessage({ message: "Role created successfully", severity: "success" }));
      router.push(URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW);
      setIsFormSubmitted(false);
    }).catch((error) => {
      dispatch(showToastMessage({ message: 'Role already exists', severity: "error" }));
      setIsFormSubmitted(false);
    })
  }

  return (
    <div className="pt-5.5">
      <PageMetaData title="Create Role" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Role List",
            path: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW,
            icon: (
              <EngineeringOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Role" },
        ]}
      />
      <CreateRoleComponent
        permissions={permissions}
        handleRoleSubmit={handleRoleCreate} 
        isFormSubmitted={isFormSubmitted}
      />
    </div>
  );
}