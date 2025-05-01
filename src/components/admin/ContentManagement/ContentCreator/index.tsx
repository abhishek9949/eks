"use client";

import React, { useEffect, useState } from "react";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ContentCreatorForm from "./ContentCreatorForm";
import {
  contentCreatorDataAdminSide,
  ContentCreatorFormInitialValue,
} from "@/types/contentCreatorProfile";
import { MenuBookOutlined } from "@mui/icons-material";
import {
  useCreateUpdateContentCreatorProfileMutation,
  useDeleteContentCreatorProfileMutation,
  useLazyGetContentCreatorProfileForAdminQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import Loader from "@/components/common/Loader";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { CONSTANT_MESSAGE } from "@/constants/globalConstant";

const ContentCreatorComp = () => {
  const dispatch = useAppDispatch();
  const [createUpdateContentCreatorProfile] =
    useCreateUpdateContentCreatorProfileMutation();
  const [getContentCreatorProfileForAdmin] =
    useLazyGetContentCreatorProfileForAdminQuery();
  const [deleteContentCreatorProfile] =
    useDeleteContentCreatorProfileMutation();
  const [contentCreatorData, setContentCreatorData] =
    useState<contentCreatorDataAdminSide>({} as contentCreatorDataAdminSide);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isProfileDeleted, setIsProfileDeleted] = useState<boolean>(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const userId = useAppSelector(
    (state) => state.cookies.cookies.userCookies?.user_id,
  );

  const handleDeleteContentCreatorProfile = () => {
    setIsProfileDeleted(true);
    deleteContentCreatorProfile({
      endpoint: API_CONSTANTS.DELETE_CONTENT_CREATOR_PROFILE,
      method: "DELETE",
      data: {},
    })
      .unwrap()
      .then((res) => {
        setIsProfileDeleted(false);
        dispatch(
          showToastMessage({
            message: res?.message,
            severity: "success",
          }),
        );
        // @ts-ignore
        setContentCreatorData({}); // Reset form data
        setIsEditable(false);
      })
      .catch((err) => {
        setIsProfileDeleted(false);
        dispatch(
          showToastMessage({
            message: err?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  const fetchContentCreatorProfileForAdmin = () => {
    setApiLoading(true);
    getContentCreatorProfileForAdmin({
      endpoint: `${API_CONSTANTS.GET_CONTENT_CREATOR_PROFILE_FOR_ADMIN}/${userId}`,
    })
      .unwrap()
      .then((res) => {
        setContentCreatorData(res);
        setApiLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setApiLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchContentCreatorProfileForAdmin();
    }
  }, [userId]);

  const initialValues: ContentCreatorFormInitialValue = {
    profile_picture: contentCreatorData
      ? contentCreatorData?.profile_picture
      : "",
    creator_name: contentCreatorData ? contentCreatorData?.username : "",
    edu_experience: contentCreatorData
      ? contentCreatorData?.answers?.educational_experience
      : "",
    current_job: contentCreatorData
      ? contentCreatorData?.answers?.current_role
      : "",
    teaching_reason: contentCreatorData
      ? contentCreatorData?.answers?.teaching_love
      : "",
    anything_else: contentCreatorData
      ? contentCreatorData?.answers?.additional_info
      : "",
    social_media: {
      instagram_link: contentCreatorData
        ? contentCreatorData?.social_links?.instagram
        : null,
      tiktok_link: contentCreatorData
        ? contentCreatorData?.social_links?.tiktok
        : null,
      facebook_link: contentCreatorData
        ? contentCreatorData?.social_links?.facebook
        : null,
      x_link: contentCreatorData ? contentCreatorData?.social_links?.x : null,
      linkedIn_link: contentCreatorData
        ? contentCreatorData?.social_links?.linkedin
        : null,
      other_link: contentCreatorData
        ? contentCreatorData?.social_links?.other
        : null,
    },
  };

  const handleSubmit = async (values: ContentCreatorFormInitialValue) => {
    setIsFormSubmitted(true);
    const formData = new FormData();
    if (values.profile_picture) {
      formData.append("profile_picture", values.profile_picture);
    }
    if (values.creator_name && !contentCreatorData?.username) {
      formData.append("name", values.creator_name);
    }
    if (values.edu_experience) {
      formData.append("educational_experience", values.edu_experience);
    }
    if (values.current_job) {
      formData.append("current_role", values.current_job);
    }
    if (values.teaching_reason) {
      formData.append("teaching_love", values.teaching_reason);
    }
    if (values.anything_else) {
      formData.append("additional_info", values.anything_else);
    }

    // Socail media links
    if (values.social_media.instagram_link)
      formData.append("instagram", values.social_media.instagram_link);
    if (values.social_media.tiktok_link)
      formData.append("tiktok", values.social_media.tiktok_link);
    if (values.social_media.facebook_link)
      formData.append("facebook", values.social_media.facebook_link);
    if (values.social_media.x_link)
      formData.append("x", values.social_media.x_link);
    if (values.social_media.linkedIn_link)
      formData.append("linkedin", values.social_media.linkedIn_link);
    if (values.social_media.other_link)
      formData.append("other", values.social_media.other_link);

    try {
      let contentProfileRes = await createUpdateContentCreatorProfile({
        endpoint: API_CONSTANTS.CREATE_UPDATE_CONTENT_CREATOR_PROFILE,
        method: "POST",
        data: formData,
      }).unwrap();
      dispatch(
        showToastMessage({
          message: contentProfileRes?.message,
          severity: "success",
        }),
      );
      fetchContentCreatorProfileForAdmin();
      setIsEditable(false);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsFormSubmitted(false);
    }
  };

  return (
    <div className="relative">
      <PageMetaData title="Creator Profile" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Manage Content",
            path: URL_CONSTANTS.ADMIN_CONTENT_LIST,
            icon: (
              <MenuBookOutlined className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Creator Profile" },
        ]}
      />
      <div className="absolute right-0 top-6 sm:absolute sm:-top-2">
        {contentCreatorData?.username && isEditable === false && (
          <Button
            type="button"
            variant="contained"
            size="medium"
            startIcon={<EditIcon />}
            onClick={(e) => {
              e.preventDefault();
              setIsEditable(true);
            }}
          >
            {CONSTANT_MESSAGE.EDIT_BTN_LABEL}
          </Button>
        )}
      </div>
      {apiLoading || isProfileDeleted || isFormSubmitted ? (
        <Loader />
      ) : (
        <ContentCreatorForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isFormSubmitted={isFormSubmitted}
          contentCreatorData={contentCreatorData}
          handleDeleteContentCreatorProfile={handleDeleteContentCreatorProfile}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      )}
    </div>
  );
};

export default ContentCreatorComp;
