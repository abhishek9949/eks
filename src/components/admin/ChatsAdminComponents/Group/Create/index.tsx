"use client";

import React, { useState } from "react";
import { API_CONSTANTS } from "@/constants/api";
import { useCreateGroupMutation } from "@/redux/allReducer";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { GlobalUsersList } from "@/types/user";
import CreateGroupForm from "./CreateGroupForm";
import PageMetaData from "@/components/common/PageMetaData";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { CreateGroupInitailValues } from "@/types/chatAdminTypes";

const CreateGroupComponent = () => {
  const dispatch = useAppDispatch();
  const [createNewGroup] = useCreateGroupMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const handleCreateGroup = (values: CreateGroupInitailValues) => {
    setIsFormSubmitted(true);
    const data = {
      group_name: values?.groupName,
      members: values?.peopleSelected?.map(
        (member: GlobalUsersList) => member?.user_id,
      ),
      is_public: values?.is_public,
    };
    createNewGroup({
      endpoint: API_CONSTANTS.CREATE_GROUP,
      method: "POST",
      data,
    })
      .unwrap()
      .then((res) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: res?.message,
            severity: "success",
          }),
        );
      })
      .catch((error) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  return (
    <>
      <PageMetaData title="Create Group" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Group" },
        ]}
      />
      <CreateGroupForm
        handleCreateGroup={handleCreateGroup}
        isFormSubmitted={isFormSubmitted}
      />
    </>
  );
};

export default CreateGroupComponent;
