"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import PageMetaData from "@/components/common/PageMetaData";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { Button, Divider, Pagination, Stack } from "@mui/material";
import Image from "next/image";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CreateBin from "@/components/BinComponents/CommonBinComponent/CreateBin/CreateBinForm";
import ToggleBtnGridList from "@/components/BinComponents/CommonBinComponent/ToggleBtnGridList";
import {
  useCreateNewBinMutation,
  useLazyGetSharedBinsQuery,
  useRemoveSharedBinsMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import ShareWitMeListingComponent from "@/components/BinComponents/ShareWithMe/ShareWitMeListingComponent";
import { useRouter } from "next/navigation";
import { SharedBinSingleData } from "@/types/bins/binsType";
import { changeBinAlignment } from "@/redux/slices/binSlice";
import Loader from "@/components/common/Loader";

export default function ShareWithMeComp() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const alignment = useAppSelector((state) => state.binSlice.alignment);
  const [openCreateBinDialog, setOpenCreateBinDialog] = useState(false);
  const [getSharedBins] = useLazyGetSharedBinsQuery();
  const [createNewBin] = useCreateNewBinMutation();
  const [removeSharedBins] = useRemoveSharedBinsMutation();

  const [sharedBinsData, setSharedBinsData] = useState<SharedBinSingleData[]>(
    [],
  );
  const [apiLoading, setApiLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
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

  const handleDeleteSharedBin = (binId: number) => {
    removeSharedBins({
      endpoint: `${API_CONSTANTS.REMOVE_SHARED_BINS}`,
      method: "PUT",
      data: { bin_id: binId },
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Bin removed successfully",
            severity: "success",
          }),
        );
        fetchSharedBinsData();
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

  const fetchSharedBinsData = async () => {
    setApiLoading(true);
    try {
      const response = await getSharedBins({
        endpoint: `${API_CONSTANTS.GET_SHARED_BINS}?page=${page}&page_size=${pageSize}&sort_by=${sortColumn}&sort_order=${sortDirection}`,
        method: "GET",
      }).unwrap();

      setSharedBinsData(response?.results?.data);
      setPageCount(Math.ceil(response?.count / pageSize));
      setApiLoading(false);
    } catch (error: any) {
      dispatch(
        showToastMessage({
          message: error?.data?.message || "Error fetching data",
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
    fetchSharedBinsData();
  }, [page, sortColumn, sortDirection]);

  useLayoutEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };
    // Initial check for the size
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
      <PageMetaData title="Shared with me" />

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
              { name: "Shared with me" },
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
          <ShareWitMeListingComponent
            myBinsData={sharedBinsData}
            isBinDataLoading={apiLoading}
            initialLoading={initialLoading}
            alignment={alignment}
            handleDeleteBin={handleDeleteSharedBin}
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
