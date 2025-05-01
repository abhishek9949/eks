import React, { useEffect, useLayoutEffect, useState } from "react";
import PageMetaData from "@/components/common/PageMetaData";
import { Divider, Pagination, Stack } from "@mui/material";
import ToggleBtnGridList from "@/components/BinComponents/CommonBinComponent/ToggleBtnGridList";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useLazyGetContentFromBinQuery,
  useRemoveContentFromBinMutation,
} from "@/redux/allReducer";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { API_CONSTANTS } from "@/constants/api";
import MyBinContents from "./MyBinContents";
import {
  GetContentFromBinData,
  GetContentFromBinRes,
} from "@/types/bins/binsType";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { changeBinAlignment } from "@/redux/slices/binSlice";
import Loader from "@/components/common/Loader";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

const MyBinContentContainer = (props: { binId: number }) => {
  const pathname = usePathname();
  const hasRecents = pathname.includes("/recents");
  const hasSharedWithMe = pathname.includes("/shared-with-me");
  const { binId } = props;
  const dispatch = useAppDispatch();
  const [getContentFromBin] = useLazyGetContentFromBinQuery();
  const [removeContentFromBin] = useRemoveContentFromBinMutation();
  const [binContentRes, setBinContentRes] = useState<GetContentFromBinRes>();
  const [binContentData, setBinContentData] = useState<GetContentFromBinData[]>(
    [],
  );
  const [apiLoading, setApiLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const alignment = useAppSelector((state) => state.binSlice.alignment);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const pageSize = 12;

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

  const handleRemoveBinContent = (contentId: number | string) => {
    const payload = {
      bin_id: Number(binId),
      content_ids: [String(contentId)],
    };

    removeContentFromBin({
      endpoint: `${API_CONSTANTS.REMOVE_CONTENT_FROM_BIN}/`,
      method: "DELETE",
      data: payload,
    })
      .unwrap()
      .then(() => {
        dispatch(
          showToastMessage({
            message: "Content deleted successfully",
            severity: "success",
          }),
        );
        fetchBinsContentData();
      })
      .catch(() => {
        dispatch(
          showToastMessage({
            message: "Error while deleting the Content",
            severity: "error",
          }),
        );
      });
  };

  const fetchBinsContentData = async () => {
    setApiLoading(true);
    try {
      const response = await getContentFromBin({
        endpoint: `${API_CONSTANTS.GET_CONTENT_FROM_BIN}/${binId}/get-entities/?page=${page}&page_size=${pageSize}`,
        method: "GET",
      }).unwrap();
      setBinContentRes(response);
      setBinContentData(response?.results?.data);
      setPageCount(Math.ceil(response?.count / pageSize));
      setApiLoading(false);
    } catch (error: any) {
      dispatch(
        showToastMessage({
          message: error?.data?.error || "Error fetching bin content",
          severity: "error",
        }),
      );
      setApiLoading(false);
    } finally {
      setApiLoading(false);
      setInitialLoading(false);
    }
  };

  const changeBreadcrumbName = () => {
    let breadcrumbName = "My Bin";
    if (hasRecents) {
      breadcrumbName = "Recents";
    } else if (hasSharedWithMe) {
      breadcrumbName = "Shared with me";
    }
    return breadcrumbName;
  };

  const changeBreadcrumbLogo = () => {
    let breadcrumbLogo = (
      <div className="align-center flex h-4 w-4 text-gray-breadcrumb">
        <Image width={30} height={30} alt="Bin" src="/svg/Bin.svg" />
      </div>
    );
    if (hasRecents) {
      breadcrumbLogo = (
        <AccessTimeIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
      );
    } else if (hasSharedWithMe) {
      breadcrumbLogo = (
        <PeopleAltOutlinedIcon className="align-center flex h-4 w-4 text-gray-breadcrumb" />
      );
    }
    return breadcrumbLogo;
  };

  const changeBreadcrumbPath = () => {
    let breadcrumbPath = `${URL_CONSTANTS.BINS}/mybin`;
    if (hasRecents) {
      breadcrumbPath = `${URL_CONSTANTS.BINS}/recents`;
    } else if (hasSharedWithMe) {
      breadcrumbPath = `${URL_CONSTANTS.BINS}/shared-with-me`;
    }
    return breadcrumbPath;
  };

  const changeBreadcrumbSourceForContentDetails = () => {
    let breadcrumbSource = "mybin";
    if (hasRecents) {
      breadcrumbSource = "recents";
    } else if (hasSharedWithMe) {
      breadcrumbSource = "shared-with-me";
    }
    return breadcrumbSource;
  };

  useEffect(() => {
    fetchBinsContentData();
  }, [page, binId]);

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
      <PageMetaData title={changeBreadcrumbName()} />

      <div className="flex items-center justify-between">
        <div>
          <BreadcrumbComponent
            levels={[
              {
                name: changeBreadcrumbName(),
                path: changeBreadcrumbPath(),
                icon: changeBreadcrumbLogo(),
              },
              { name: binContentRes?.results?.bin_name },
            ]}
          />
        </div>
        <div className="hidden items-center gap-3 pb-4 sm:flex">
          <div>
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
          <MyBinContents
            binContentData={binContentData}
            isBinDataLoading={apiLoading}
            initialLoading={initialLoading}
            alignment={alignment}
            handleRemoveBinContent={handleRemoveBinContent}
            breadcrumbSource={changeBreadcrumbSourceForContentDetails}
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
};

export default MyBinContentContainer;
