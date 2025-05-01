"use client";

import React, { useState } from "react";
import { useCreateCommunityMutation } from "@/redux/allReducer";
import { useRouter } from "next/navigation";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { InitialValues, ForumResponse } from "@/types/community";
import { FormikHelpers } from "formik";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { useCategoryList } from "@/hooks/useCategoryList";
import {
  BreadcrumbComponent,
  CreateCommunityComponent,
} from "@/components/common/DynamicImports";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import PageMetaData from "@/components/common/PageMetaData";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const CreateCommuintyPage = () => {
  const router = useRouter();
  const [createCommuinty] = useCreateCommunityMutation();
  const { categoryList } = useCategoryList("community");
  const dispatch = useAppDispatch();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const initialValues = {
    topic_title: "",
    topic_description: "",
    category: [],
    is_public:
      checkPermissionExists(
        PERMISSIONS.COMMUNITY_MANAGEMENT.PUBLIC_COMMUNITY_ACCESS,
        permissions,
      ) && true,
  };

  const handleSubmit = (
    values: ForumResponse,
    formikHelpers: FormikHelpers<InitialValues>,
  ) => {
    const payload: ForumResponse = {
      ...values,
    };
    setIsFormSubmitted(true);
    createCommuinty({
      endpoint: API_CONSTANTS.CREATE_COMMUNITY,
      method: "POST",
      data: payload,
    })
      .then((res) => {
        if (res?.data) {
          router.push(URL_CONSTANTS.ADMIN_COMMUNITY_LIST); // Redirect on success
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

  return (
    <div className="pt-5.5">
      <PageMetaData title="Create Community" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Community List",
            path: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
            icon: (
              <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Create Community" },
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

export default CreateCommuintyPage;
