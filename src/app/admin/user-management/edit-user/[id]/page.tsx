"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  useLazyGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CreateUserValues, EditUserParams } from "@/types/userManagementType";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  BreadcrumbComponent,
  CommonUserFormComponent,
} from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";

const EditUser = ({ params }: EditUserParams) => {
  const { id } = params;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<CreateUserValues | null>(
    null,
  );
  const [getSingleUser] = useLazyGetSingleUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    getSingleUser({ endpoint: `${API_CONSTANTS.GET_SINGLE_USER}/${id}` })
      .unwrap()
      .then((res) => {
        setInitialValues({
          firstname: res?.first_name,
          lastname: res?.last_name,
          email: res?.email,
          role_id: res?.role_id,
          organisation_id: res?.organisation_id,
        });
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.error,
            severity: "error",
          }),
        );
      });
  }, [id]);

  const handleSubmit = (values: CreateUserValues) => {
    setIsFormSubmitted(true);
    const editUserPayload = {
      email: values.email,
      first_name: values.firstname,
      last_name: values.lastname,
      role_id: values.role_id,
      organisation_id: values.organisation_id,
    };

    updateUser({
      endpoint: `${API_CONSTANTS.UPDATE_USER}/${id}/`,
      method: "PUT",
      data: editUserPayload,
    })
      .unwrap()
      .then((editRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: editRes?.message,
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER);
      })
      .catch((editErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: editErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  if (!initialValues) return <p>Loading...</p>;

  return (
    <div className="pt-5.5">
      <PageMetaData title="Edit User" />
      <BreadcrumbComponent
        levels={[
          {
            name: "User List",
            path: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER,
            icon: (
              <GroupsIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit User" },
        ]}
      />
      <CommonUserFormComponent
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isFormSubmitted={isFormSubmitted}
      />
    </div>
  );
};

export default EditUser;
