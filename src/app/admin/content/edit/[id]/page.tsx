"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCategoryList } from "@/hooks/useCategoryList";
import ContentForm from "@/components/admin/ContentManagement/ContentForm";
import {
  InitialValues,
  GetContentByIdResponse,
  UseCategoryListResponse,
} from "@/types/content";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  useEditContentMutation,
  useLazyGetContentByIdQuery,
} from "@/redux/allReducer";
import Loader from "@/components/common/Loader";
import { PageProps } from "@/types/common";
import PageMetaData from "@/components/common/PageMetaData";
import { useCheckContentCreatorProfile } from "@/hooks/useCheckContentCreatorProfile";
import CheckContentCreatorProfileDialog from "@/components/admin/ContentManagement/CheckContentCreatorProfileDialog";

const EditContent = ({ params }: PageProps) => {
  const { checkContentCreatorRes } = useCheckContentCreatorProfile();
  const { id } = params;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<InitialValues | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const {
    categoryList = [],
    loading: categoryLoading,
  }: UseCategoryListResponse = useCategoryList("content");

  const [getSingleContent] =
    useLazyGetContentByIdQuery<GetContentByIdResponse>();
  const [editContentMutation] = useEditContentMutation();

  // Fetch forum details after category details are fetched
  useEffect(() => {
    if (
      !categoryLoading &&
      id &&
      Array.isArray(categoryList) &&
      categoryList.length > 0
    ) {
      const fetchContentDetails = () => {
        getSingleContent({
          endpoint: `${API_CONSTANTS.API_CONTENT}preview/${id}`,
        })
          .unwrap()
          .then((response) => {
            if (response as GetContentByIdResponse) {
              const typedResponse = response as GetContentByIdResponse;

              const fileName: string =
                typedResponse.file.url.split("/").pop() ?? "";
              const mimeType =
                typedResponse?.file?.format === "pdf"
                  ? "application/pdf"
                  : typedResponse?.file?.format;
              const file = mimeType
                ? new File([], fileName, { type: mimeType })
                : null;
              const thumbnailImageExtension =
                typedResponse?.thumbnail_original_name
                  ? `image/${typedResponse?.thumbnail_original_name?.split(".")[1]}`
                  : "";
              const thumbnailFile = thumbnailImageExtension
                ? new File([], typedResponse?.thumbnail_original_name, {
                    type: thumbnailImageExtension,
                  })
                : null;
              setInitialValues({
                title: typedResponse.title || "",
                description: typedResponse.description || "",
                tags: typedResponse.tags.join(", ") || "",
                content_type: typedResponse.content_type || "",
                thumbnail_file: thumbnailFile,
                file: file,
                category: typedResponse.categories || [],
                thumbnail_url:
                  typedResponse.thumbnail_original_name ||
                  typedResponse.thumbnail_url === "none"
                    ? ""
                    : typedResponse.thumbnail_url,
                thumbnailType: "file",
              });
            }
          })
          .catch((error) => {
            dispatch(
              showToastMessage({
                message: error?.data?.error,
                severity: "error",
              }),
            );
          });
      };

      fetchContentDetails();
    }
  }, [categoryList, categoryLoading]);

  const handleFormSubmit = (values: InitialValues) => {
    const metadata = {
      title: values.title || "",
      description: values.description || "",
      content_type: values.content_type || "unknown",
      tags: values.tags?.split(",").map((tag: string) => tag.trim()) || [],
      categories:
        values.category && values.category.length > 0
          ? values.category
          : initialValues?.category,
    };
    const formData = new FormData();
    if (values.file && values?.isFileUploaded)
      formData.append("file", values.file);
    if (values.thumbnail_file && values?.isThumbnailUploaded)
      formData.append("thumbnail_file", values.thumbnail_file || "");
    if (values?.thumbnail_url)
      formData.append("thumbnail_reference", values.thumbnail_url);
    if (values?.isThumbnailUploaded && values?.thumbnail_file === null)
      formData.append("thumbnail_reference", "none");
    formData.append("metadata", JSON.stringify(metadata));

    editContentMutation({
      endpoint: `${API_CONSTANTS.CONTENT_UPDATE}${id}`,
      method: "PUT",
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

  if (!initialValues) return <Loader />;

  return (
    <div className="pt-5.5">
      <PageMetaData title="Edit Content" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Content List",
            path: URL_CONSTANTS.ADMIN_CONTENT_LIST,
            icon: (
              <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Content" },
        ]}
      />
      <ContentForm
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        categoryList={categoryList}
      />
      <CheckContentCreatorProfileDialog
        openDialog={checkContentCreatorRes?.is_creator_created === false}
      />
    </div>
  );
};

export default EditContent;
