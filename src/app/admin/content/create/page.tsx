"use client";

import React from "react";
import { useCategoryList } from "@/hooks/useCategoryList";
import { InitialValues } from "@/types/content";
import {
  BreadcrumbComponent,
  ContentFormComponents,
} from "@/components/common/DynamicImports";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { API_CONSTANTS } from "@/constants/api";
import { useCreateContentMutation } from "@/redux/allReducer";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import PageMetaData from "@/components/common/PageMetaData";
import { useCheckContentCreatorProfile } from "@/hooks/useCheckContentCreatorProfile";
import CheckContentCreatorProfileDialog from "@/components/admin/ContentManagement/CheckContentCreatorProfileDialog";

const CreateForum = () => {
  const { checkContentCreatorRes } = useCheckContentCreatorProfile();
  const [createContent] = useCreateContentMutation();
  const router = useRouter();
  const { categoryList } = useCategoryList("content");
  const dispatch = useAppDispatch();

  const initialValues = {
    title: "",
    description: "",
    tags: "",
    content_type: "",
    thumbnail_file: null,
    file: null,
    category: [],
    thumbnail_url: "",
    thumbnailType: "file",
  };

  // Form Submission Handler
  const handleFormSubmit = (values: InitialValues) => {
    const metadata = {
      title: values.title || "",
      description: values.description || "",
      content_type: values.content_type || "unknown",
      tags: values.tags?.split(",").map((tag: string) => tag.trim()) || [],
      categories: values.category || [],
    };

    const formData = new FormData();
    if (values.file) formData.append("file", values.file);
    if (values.thumbnail_file)
      formData.append("thumbnail_file", values.thumbnail_file || "");
    formData.append("thumbnail_reference", values.thumbnail_url || "none");
    formData.append("metadata", JSON.stringify(metadata));

    createContent({
      endpoint: API_CONSTANTS.CREATE_CONTENT,
      method: "POST",
      data: formData,
    })
      .then((res) => {
        if (res?.data) {
          const data = res.data as { message?: string };
          if (data.message) {
            dispatch(
              showToastMessage({
                message: data.message,
                severity: "success",
              }),
            );
          }
          router.push(URL_CONSTANTS.ADMIN_CONTENT_LIST);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  return (
    <div className="pt-5.5">
      <PageMetaData title="Create Content" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Content List",
            path: URL_CONSTANTS.ADMIN_CONTENT_LIST,
            icon: (
              <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Content" },
        ]}
      />
      <ContentFormComponents
        initialValues={initialValues as InitialValues}
        onSubmit={handleFormSubmit}
        categoryList={categoryList}
      />
      <CheckContentCreatorProfileDialog
        openDialog={checkContentCreatorRes?.is_creator_created === false}
      />
    </div>
  );
};

export default CreateForum;
