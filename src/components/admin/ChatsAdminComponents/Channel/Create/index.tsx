"use client";

import React, { useState } from "react";
import CreateChannelForm from "@/components/admin/ChatsAdminComponents/Channel/Create/CreateChannelForm";
import PageMetaData from "@/components/common/PageMetaData";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { useRouter } from "next/navigation";
import { useCreateChannelMutation } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { CreateChannelInitialValueType } from "@/types/chatAdminTypes";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const CreateChannelComp = () => {
  const { cookies } = useAppSelector((state) => state.cookies);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [createChannel] = useCreateChannelMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const permissions = cookies?.permissionCookie || [];

  const initialValues: CreateChannelInitialValueType = {
    channel_name: "",
    channel_description: "",
    is_public:
      checkPermissionExists(
        PERMISSIONS.CHAT_MANAGEMENT.BLOCKED_CHANNEL,
        permissions,
      ) && true,
  };

  const handleSubmit = (values: CreateChannelInitialValueType) => {
    setIsFormSubmitted(true);
    createChannel({
      endpoint: API_CONSTANTS.CREATE_CHANNEL,
      method: "POST",
      data: {
        channel_name: values.channel_name,
        description: values.channel_description,
        is_public: values.is_public,
      },
    })
      .unwrap()
      .then((createChannelRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message:
              createChannelRes?.message || "Channel created successfully",
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_CHANNEL);
      })
      .catch((createChannelErr) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message:
              createChannelErr?.message || "Error while createing the channel",
            severity: "error",
          }),
        );
      });
  };

  return (
    <>
      <PageMetaData title="Create Channel" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Channel" },
        ]}
      />
      <CreateChannelForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        isFormSubmitted={isFormSubmitted}
      />
    </>
  );
};

export default CreateChannelComp;
