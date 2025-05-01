"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BreadcrumbComponent,
  CreateCommunityComponent,
} from "@/components/common/DynamicImports";
import Loader from "@/components/common/Loader";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  InitialValues,
  ForumResponse,
  CategoryList,
} from "@/types/community";
import {
  GetSingleForumDetailsResType,
} from "@/types/community/CommunityDetails";
import { PageProps } from "@/types/common"
import { FormikHelpers } from "formik";
import { useCategoryList } from "@/hooks/useCategoryList";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  useLazyGetSingleForumDetailsQuery,
  useEditCommunityMutation,
} from "@/redux/allReducer";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PageMetaData from "@/components/common/PageMetaData";


interface UseCategoryListResponse {
  categoryList: CategoryList[];
  loading: boolean;
}

const EditForum = ({ params }: PageProps) => {
  const { id } = params;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<ForumResponse | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const [getSingleForumDetails] = useLazyGetSingleForumDetailsQuery();
  const [editCommuinty] = useEditCommunityMutation();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const {
    categoryList = [],
    loading: categoryLoading,
  }: UseCategoryListResponse = useCategoryList("community");

  const mapCategory = (category: CategoryList[]): { id: number; label: string }[] => {
    return category.map((cat) => ({
      id: cat.category_id,
      label: cat.name,
    }));
  };

  // Fetch forum details after category details are fetched
  useEffect(() => {
    if (
      !categoryLoading &&
      id &&
      Array.isArray(categoryList) &&
      categoryList.length > 0
    ) {
      const fetchForumDetails = () => {
        getSingleForumDetails({
          endpoint: `${API_CONSTANTS.GET_FORUM_DETAILS_BY_ID}/${id}`,
        })
          .unwrap()
          .then((response: GetSingleForumDetailsResType) => {
            const res = response.data as unknown as ForumResponse;
            if (res) {
              setInitialValues({
                topic_title: res.topic_title || "",
                category: res.category ? mapCategory(res.category as unknown as CategoryList[]) : [],
                topic_description: res.topic_description || "",
                is_public: res.is_public,
              });
              
            }
          })
          .catch((error) => {
            dispatch(
              showToastMessage({
                message: error?.data?.error || "Failed to fetch forum details.",
                severity: "error",
              }),
            );
          });
      };

      fetchForumDetails();
    }
  }, [categoryList, categoryLoading]);

  const handleSubmit = (
    values: ForumResponse,
    formikHelpers: FormikHelpers<InitialValues>,
  ) => {
    const payload: ForumResponse = { ...values };
    setIsFormSubmitted(true);
    editCommuinty({
      endpoint: `${API_CONSTANTS.GET_FORUM_LIST}${id}/update/`,
      method: "PUT",
      data: payload,
    })
      .then((res) => {
        if (res?.data) {
          router.push(URL_CONSTANTS.ADMIN_COMMUNITY_LIST);
        }
        setIsFormSubmitted(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
        setIsFormSubmitted(false);
      });

    formikHelpers.resetForm();
  };

  if (!initialValues) return <Loader />;

  return (
    <div className="pt-5.5">
      <PageMetaData title="Edit Community" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Community List",
            path: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
            icon: (
              <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Edit Community" },
        ]}
      />
      <CreateCommunityComponent
        initialValues={initialValues}
        onSubmit={handleSubmit}
        categoryList={categoryList}
        isFormSubmitted={isFormSubmitted}
      />
    </div>
  );
};

export default EditForum;
