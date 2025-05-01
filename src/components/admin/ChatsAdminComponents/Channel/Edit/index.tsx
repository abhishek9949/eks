"use client";

import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  useLazyGetSingleChannelQuery,
  useUpdateChannelMutation,
} from "@/redux/allReducer";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CreateChannelForm from "@/components/admin/ChatsAdminComponents/Channel/Create/CreateChannelForm";
import { CreateChannelInitialValueType } from "@/types/chatAdminTypes";

const UpdateChannel = ({ id }: { id: number | string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<CreateChannelInitialValueType>();
  const [getSingleChannel] = useLazyGetSingleChannelQuery();
  const [updateChannel] = useUpdateChannelMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  useEffect(() => {
    getSingleChannel({ endpoint: `${API_CONSTANTS.GET_SINGLE_CHANNEL}/${id}` })
      .unwrap()
      .then((res) => {
        setInitialValues({
          channel_name: res?.data?.channel_name,
          channel_description: res?.data?.description,
          is_public: res?.data?.is_public,
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

  const handleSubmit = (values: CreateChannelInitialValueType) => {
    setIsFormSubmitted(true);
    const editChannelPayload = {
      channel_name: values.channel_name,
      description: values.channel_description,
      is_public: values.is_public,
    };

    updateChannel({
      endpoint: `${API_CONSTANTS.UPDATE_CHANNEL}/${id}`,
      method: "PUT",
      data: editChannelPayload,
    })
      .unwrap()
      .then((editRes) => {
        setIsFormSubmitted(false);
        dispatch(
          showToastMessage({
            message: editRes?.message || "Channel updated successfully.",
            severity: "success",
          }),
        );
        router.push(URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_VIEW_CHANNEL);
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
    <>
      <PageMetaData title="Edit Channel" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Channel" },
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

export default UpdateChannel;
