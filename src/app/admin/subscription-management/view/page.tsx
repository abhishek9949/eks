"use client";
import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { Add, PaymentOutlined } from "@mui/icons-material";
import Link from "next/link";
import {
  useChangeSubscriptionPlanStatusMutation,
  useDeleteSubscriptionPlanMutation,
  useLazyGetSubscriptionPlanListQuery,
  usePublishSubscriptionPlanMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  ChangeSubscriptionPlanStatusSuccssProps,
  SubscriptionDetailsProps,
} from "@/types/subscription";
import {
  BreadcrumbComponent,
  SubscriptionListComponent,
} from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { useRouter } from "next/navigation";
import { checkPermissionExists } from "@/utils/permissionFormate";
import { PERMISSIONS } from "@/constants/permissionsNames";

const ViewSubscriptionPlanHomePage = () => {
  const router = useRouter();
  const [apiLoading, setApiLoading] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetailsProps | []>([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [callApi, setCallApi] = useState(true);
  const [getSubscriptionPlanList] = useLazyGetSubscriptionPlanListQuery();
  const [deleteSubscriptionPlan] = useDeleteSubscriptionPlanMutation();
  const [changeSubscriptionPlanStatus] =
    useChangeSubscriptionPlanStatusMutation();
  const [publishSubscriptionPlan] = usePublishSubscriptionPlanMutation();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state?.filterSlice?.subscriptionFilters);
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];
  
  const getSubscriptionList = (setPageNumber: boolean) => {
    const { planName, planType, planStatus, searchText, createdAt, sortColumn, sortDirection } = filters;
    let pageNumber = page;
    if (setPageNumber) {
      pageNumber = 1;
      setCallApi(false);
      setPage(1);
    } 

    setApiLoading(true);
    getSubscriptionPlanList({
      endpoint: `${API_CONSTANTS.GET_SUBSCRIPTION_PLAN_LIST}?page=${pageNumber}&page_size=${rowsPerPage}&query_text=${searchText}&plan_name=${planName}&plan_type=${planType}&is_active=${planStatus}&created_at=${createdAt}&sort_by=${sortColumn}&order=${sortDirection}`,
    }).unwrap().then((result) => {
        setSubscriptionDetails(result as SubscriptionDetailsProps);
    }).catch((error) => {
      if(error.status === 403) {
          router.push("/403");
      } else {
      dispatch(
        showToastMessage({ message: error?.data?.error, severity: "error" }),
      );
    }
    }).finally(() => {
      setCallApi(true);
      setApiLoading(false);
    });
  };

  useEffect(() => {
    getSubscriptionList(true);
  }, [filters]);

  useEffect(() => {
    if (callApi) {
      getSubscriptionList(false);
    }
  }, [page, rowsPerPage]);

  const handleDeleteSubscriptionPlan = (planId: number) => {
    deleteSubscriptionPlan({
      endpoint: API_CONSTANTS.SUBSCRIPTION_PLAN + planId,
      method: "DELETE",
    })
      .unwrap()
      .then((result) => {
        if (result) {
          dispatch(
            showToastMessage({
              message: "Subscription plan deleted successfully",
              severity: "success",
            }),
          );
          getSubscriptionList(false);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleChangeSubscriptionPlanStatus = (
    planId: number,
    isActive: boolean,
  ) => {
    changeSubscriptionPlanStatus({
      endpoint: API_CONSTANTS.SUBSCRIPTION_PLAN + planId + "/status/",
      method: "PATCH",
      data: {
        is_active: isActive,
      },
    })
      .unwrap()
      .then((result) => {
        const { message } = result as ChangeSubscriptionPlanStatusSuccssProps;
        dispatch(showToastMessage({ message, severity: "success" }));
        getSubscriptionList(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handlePageChange = (event: React.MouseEvent | null, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handlePublishSubscriptionPlan = (planId: number) => {
    publishSubscriptionPlan({
      endpoint: API_CONSTANTS.SUBSCRIPTION_PLAN + planId + "/publish/",
      method: "PATCH",
    })
      .unwrap()
      .then((result) => {
        const { message } = result as ChangeSubscriptionPlanStatusSuccssProps;
        dispatch(showToastMessage({ message, severity: "success" }));
        getSubscriptionList(false);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  return (
    <Box className="relative pt-5.5">
     <PageMetaData title="Subscription List" />

      <BreadcrumbComponent
        levels={[
          {
            name: "Subscription Plans",
            path: URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_VIEW,
            icon: (
              <PaymentOutlined className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Subscription List" },
        ]}
      />
    {checkPermissionExists(PERMISSIONS.SUBSCRIPTION_PLANS.CREATE, permissions) &&(
      <Box className="absolute end-1 top-3.5 z-1">
        <Link href={URL_CONSTANTS.ADMIN_SUBSCRIPTION_MANAGEMENT_CREATE}>
          <Button variant="contained" startIcon={<Add />} disableRipple sx={{ backgroundColor:"primary.main" }}>
            New Subscription Plan
          </Button>
        </Link>
      </Box>
      )}
      <SubscriptionListComponent
        subscriptionDetails={subscriptionDetails}
        handleDeleteSubscriptionPlan={handleDeleteSubscriptionPlan}
        handleChangeSubscriptionPlanStatus={handleChangeSubscriptionPlanStatus}
        page={page}
        rowsPerPage={rowsPerPage}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        handlePublishSubscriptionPlan={handlePublishSubscriptionPlan}
        loading={apiLoading}
      />
    </Box>
  );
};

export default ViewSubscriptionPlanHomePage;
