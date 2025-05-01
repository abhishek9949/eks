"use client";

import React, { useState } from "react";
import { useCreateUserAndSendInvitationMutation } from "@/redux/allReducer";
import { useRouter } from "next/navigation";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { CreateUserValues } from "@/types/userManagementType";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  BreadcrumbComponent,
  CommonUserFormComponent,
} from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";

const CreateUser = () => {
  const dispatch = useAppDispatch();
  const organizationId = useAppSelector((state) => state.cookies.cookies.userCookies?.organization_id);

  const initialValues: CreateUserValues = {
    firstname: "",
    lastname: "",
    email: "",
    role_id: null,
    organisation_id: null,
  };
  const router = useRouter();
  const [createUserAndSendInvitation] =
    useCreateUserAndSendInvitationMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const handleSubmit = (values: CreateUserValues) => {
    setIsFormSubmitted(true);
    createUserAndSendInvitation({
      endpoint: API_CONSTANTS.CREATE_USER_AND_SEND_INVITATION,
      method: "POST",
      data: {
        email: values.email,
        first_name: values.firstname,
        last_name: values.lastname,
        role_id: values.role_id,
        organization_id: organizationId !== 0 ? organizationId : values.organisation_id,
      },
    })
      .unwrap()
      .then((createUserRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: createUserRes?.message,
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER);
      })
      .catch((createUserErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message:
              createUserErr?.data?.errors || "Error while createing the user",
            severity: "error",
          }),
        );
      });
  };

  return (
    <div className="pt-5.5">
      <PageMetaData title="Create User" />
      <BreadcrumbComponent
        levels={[
          {
            name: "User List",
            path: URL_CONSTANTS.ADMIN_USER_MANAGEMENT_VIEW_USER,
            icon: (
              <GroupsIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create User" },
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

export default CreateUser;
