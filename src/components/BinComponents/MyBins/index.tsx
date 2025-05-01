"use client";

import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  useLazyGetBinsQuery,
  useCreateNewBinMutation,
  useUpdateBinMutation,
  useDeleteBinMutation,
  useShareBinWithUsersMutation,
} from "@/redux/allReducer";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { API_CONSTANTS } from "@/constants/api";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import PageMetaData from "@/components/common/PageMetaData";
import BinsListingComponent from "@/components/BinComponents/MyBins/BinsListingComponent";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { Button, Divider, Pagination, Stack } from "@mui/material";
import Image from "next/image";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CreateBin from "@/components/BinComponents/CommonBinComponent/CreateBin/CreateBinForm";
import ToggleBtnGridList from "@/components/BinComponents/CommonBinComponent/ToggleBtnGridList";
import { useRouter, usePathname } from "next/navigation";
import { GetBinsData } from "@/types/bins/binsType";
import { changeBinAlignment } from "@/redux/slices/binSlice";
import Loader from "@/components/common/Loader";

export default function MyBinsMainComponent() {
  const pathname = usePathname();
  const hasRecents = pathname.includes("/recents");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [getBins] = useLazyGetBinsQuery();
  const [createNewBin] = useCreateNewBinMutation();
  const [updateBin] = useUpdateBinMutation();
  const [deleteBin] = useDeleteBinMutation();
  const [shareBinWithUsers] = useShareBinWithUsersMutation();
  const [myBinsData, setMyBinsData] = useState<GetBinsData[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [openCreateBinDialog, setOpenCreateBinDialog] = useState(false);
  const alignment = useAppSelector((state) => state.binSlice.alignment);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pageSize = 12;
  const [sortColumn, setSortColumn] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    setPage(1);
  };

  const handleOpenCreateBinDialog = () => {
    setOpenCreateBinDialog(true);
  };
  const handleCloseCreateBin = () => {
    setOpenCreateBinDialog(false);
  };

  const handleChangeAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    if (isSmallScreen) {
      dispatch(changeBinAlignment({ alignment: "grid" }));
    } else if (newAlignment !== null) {
      dispatch(changeBinAlignment({ alignment: newAlignment }));
    }
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const handleShareBin = (binId: number, userIds: number[]) => {
    shareBinWithUsers({
      endpoint: `${API_CONSTANTS.SHARE_BIN_WITH_USERS}`,
      method: "POST",
      data: {
        bin: binId,
        shared_with: userIds,
      },
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Bin shared successfully",
            severity: "success",
          }),
        );
      })
      .catch((err) => {
        dispatch(
          showToastMessage({
            message: err?.data?.message ?? "Error while sharing the Bin",
            severity: "error",
          }),
        );
      });
  };

  const handleDeleteBin = (binId: number) => {
    deleteBin({
      endpoint: `${API_CONSTANTS.DELETE_BIN}/${binId}`,
      method: "DELETE",
      data: {},
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Bin deleted successfully",
            severity: "success",
          }),
        );
        fetchBinsData();
      })
      .catch(() => {
        dispatch(
          showToastMessage({
            message: "Error while deleting the Bin",
            severity: "error",
          }),
        );
      });
  };

  const handleUpdateBin = (
    id: number,
    payload: { bin_name: string; bin_color: string },
  ) => {
    updateBin({
      endpoint: `${API_CONSTANTS.UPDATE_BIN}/${id}`,
      method: "PUT",
      data: payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Bin updated successfully",
            severity: "success",
          }),
        );
        fetchBinsData();
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

  const handleCreateBin = (payload: {
    bin_name: string;
    bin_color: string;
  }) => {
    createNewBin({
      endpoint: API_CONSTANTS.CREATE_NEW_BIN,
      method: "POST",
      data: payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({ message: "New bin created", severity: "success" }),
        );
        fetchBinsData();
        router.push(`${URL_CONSTANTS.BINS}/mybin`);
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

  const fetchBinsData = async () => {
    setApiLoading(true);
    try {
      const response = await getBins({
        endpoint: hasRecents
          ? `${API_CONSTANTS.GET_BINS}?filter=recent&page=${page}&page_size=${pageSize}&sort_by=${sortColumn}&sort_order=${sortDirection}`
          : `${API_CONSTANTS.GET_BINS}?page=${page}&page_size=${pageSize}&sort_by=${sortColumn}&sort_order=${sortDirection}`,
        method: "GET",
      }).unwrap();
      setMyBinsData(response?.results?.data);
      setPageCount(Math.ceil(response?.count / pageSize));
      setApiLoading(false);
    } catch (error: any) {
      dispatch(
        showToastMessage({
          message: error?.data?.error || "Error fetching data",
          severity: "error",
        }),
      );
      setApiLoading(false);
    } finally {
      setApiLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchBinsData();
  }, [page, sortColumn, sortDirection]);

  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      dispatch(changeBinAlignment({ alignment: "grid" }));
    }
  }, [isSmallScreen, dispatch]);

  return (
    <div className="pb-10">
      <PageMetaData title={hasRecents ? "Recent Bins" : "My Bins"} />

      <div className="flex items-center justify-between">
        <div>
          <BreadcrumbComponent
            levels={[
              {
                name: "Bins",
                path: `${URL_CONSTANTS.BINS}/recents`,
                icon: (
                  <div className="align-center flex h-4 w-4 text-gray-8">
                    <Image
                      width={30}
                      height={30}
                      alt="Bin"
                      src="/svg/Bin.svg"
                    />
                  </div>
                ),
              },
              { name: hasRecents ? "Recents" : "My Bin" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3 pb-4">
          <div>
            <Button
              sx={{ bgcolor: "black" }}
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              disableRipple
              onClick={handleOpenCreateBinDialog}
            >
              New
            </Button>
            <CreateBin
              openCreateBinDialog={openCreateBinDialog}
              handleCloseCreateBin={handleCloseCreateBin}
              handleCreateBin={handleCreateBin}
            />
          </div>
          <div className="hidden sm:block">
            <ToggleBtnGridList
              alignment={alignment}
              handleChangeAlignment={handleChangeAlignment}
            />
          </div>
        </div>
      </div>

      <Divider />
      <div className="min-h-[70vh]">
        {apiLoading ? (
          <Loader />
        ) : (
          <BinsListingComponent
            myBinsData={myBinsData}
            isBinDataLoading={apiLoading}
            initialLoading={initialLoading}
            alignment={alignment}
            handleUpdateBin={handleUpdateBin}
            handleDeleteBin={handleDeleteBin}
            handleShareBin={handleShareBin}
            handleSortChange={handleSortChange}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
        )}
      </div>
      <Stack spacing={2} className="my-5 flex items-end">
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          size="large"
          color="primary"
          shape="rounded"
        />
      </Stack>
    </div>
  );
}
