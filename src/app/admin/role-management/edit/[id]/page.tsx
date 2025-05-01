'use client';
import React, { useEffect, useState } from "react";
import { useEditRoleMutation, useLazyGetPermissionsQuery, useLazyGetRoleByRoleIdQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { CreateRoleSubmitProps, EditRoleParamsProps, GetRoleDetailsProps, PermissionProps } from "@/types/roleAndPermission";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useRouter } from "next/navigation";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import EngineeringOutlinedIcon from '@mui/icons-material/EngineeringOutlined';
import { BreadcrumbComponent, CreateRoleComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";

const EditRole = ({ params }: EditRoleParamsProps) => {
  const [getPermissions] = useLazyGetPermissionsQuery();
  const [getRoleByRoleId] = useLazyGetRoleByRoleIdQuery();
  const [editRole] = useEditRoleMutation();
  const [permissions, setPermissions] = useState<PermissionProps[]>([]);
  const [roleDetails, setRoleDetails] = useState<CreateRoleSubmitProps>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const roleId = params?.id;
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const getPermissonsList = () => {
    getPermissions({
      endpoint: API_CONSTANTS.GET_PERMISSIONS
    }).unwrap().then((result) => {
      setPermissions(result as PermissionProps[])
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  };

  const getRoleDetailsByRoleId = () => {
    getRoleByRoleId({
      endpoint: API_CONSTANTS.GET_ROLE_BY_ROLE_ID + roleId
    }).unwrap().then((result: GetRoleDetailsProps) => {
      const roleTemp = {
        roleName: result?.role_name,
        roleDescription: result?.description,
        selectedPermissions: result?.permissions?.map((permission) => permission?.permission_id)
      }
      setRoleDetails(roleTemp as CreateRoleSubmitProps);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
    })
  };  

  useEffect(() => {
    getPermissonsList();
    getRoleDetailsByRoleId();
  }, []);

  const handleRoleEdit = ({ roleName, roleDescription, selectedPermissions }: CreateRoleSubmitProps) => {
    setIsFormSubmitted(true);
    const permissions = selectedPermissions.map((permission) => ({id: permission}));
    editRole({
      endpoint: API_CONSTANTS.EDIT_ROLE + roleId + '/updatePermissions',
      method: "PUT",
      data: {
        role_name: roleName,
        description: roleDescription,
        permissions
      }
    }).unwrap().then(() => {
      dispatch(showToastMessage({ message: "Role updated successfully", severity: "success" }));
      router.push(URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW);
      setIsFormSubmitted(false);
    }).catch((error) => {
      dispatch(showToastMessage({ message: error?.data?.error, severity: "error" }));
      setIsFormSubmitted(false);
    })
  }

  return (
    <div className="pt-5.5">
      <PageMetaData title="Edit Role" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Role List",
            path: URL_CONSTANTS.ADMIN_ROLE_MANAGEMENT_VIEW,
            icon: (
              <EngineeringOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Role" },
        ]}
      />
      <CreateRoleComponent
        permissions={permissions}
        roleId={roleId}
        roleDetails={roleDetails}
        handleRoleSubmit={handleRoleEdit}
        isFormSubmitted={isFormSubmitted}
      />
    </div>
  );
}

export default EditRole;