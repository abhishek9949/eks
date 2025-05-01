"use client";

import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  useLazyGetReportedCommentsListQuery,
  useDeleteReportedCommentsMutation,
  useIgnoreReportedCommentsMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  BreadcrumbComponent,
  ReportedCommentsComponent,
} from "@/components/common/DynamicImports";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { useReportReasonsList } from "@/hooks/useFetchReportReasons";
import {
  ReportedCommentRes,
  SingleReportedData,
} from "@/types/community/ReportedCommentsType";
import PageMetaData from "@/components/common/PageMetaData";

function allProps(id: number | null) {
  return {
    id: `comment-list-tab-${id}`,
    "aria-controls": `comment-list-tabpanel-${id}`,
  };
}

const ReportedCommentsPage = () => {
  const dispatch = useAppDispatch();
  const { reportReasonsList, fetchReportReasons } =
    useReportReasonsList("report_count");
  const [apiLoading, setApiLoading] = useState(false);
  const [reasonTabValue, setReasonTabValue] = useState<number>(0);
  const [reasonTabIndex, setReasonTabIndex] = useState<number>(0);
  const [getReportedCommentsList] = useLazyGetReportedCommentsListQuery();
  const [deleteReportedComments] = useDeleteReportedCommentsMutation();
  const [ignoreReportedComments] = useIgnoreReportedCommentsMutation();
  const [reportedCommentsData, setReportedCommentsData] = useState<
    SingleReportedData[]
  >([]);
  const [reportedCommentObj, setReportedCommentObj] =
    useState<ReportedCommentRes>();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const handleChangeReportedReasonTab = (
    event: React.SyntheticEvent,
    newIndex: number,
  ) => {
    setReasonTabIndex(newIndex);
    const selectedReason =
      newIndex === 0 ? 0 : (reportReasonsList[newIndex - 1]?.reason_id ?? 0);
    setReasonTabValue(selectedReason);
    setPage(1);
  };

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage + 1);
    setSelectedRows([]);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const getReportedComments = () => {
    setApiLoading(true);
    getReportedCommentsList({
      endpoint: `${API_CONSTANTS.GET_REPORTED_COMMENTS_LIST}?page=${page}&page_size=${rowsPerPage}&reason_id=${reasonTabValue}&search=${searchText}`,
    })
      .unwrap()
      .then((getReportedCommentsRes) => {
        setReportedCommentObj(getReportedCommentsRes);
        const updatedReportedComments = getReportedCommentsRes?.results?.map(
          (comment) => ({
            ...comment,
            id: comment.comment_id,
          }),
        );

        setReportedCommentsData(updatedReportedComments);
        setApiLoading(false);
      })
      .catch((getReportedCommentsErr) => {
        dispatch(
          showToastMessage({
            message: getReportedCommentsErr?.data?.error,
            severity: "error",
          }),
        );
        setApiLoading(false);
      });
  };

  const handleDeleteReportedComments = (commentIds: number[]) => {
    deleteReportedComments({
      endpoint: API_CONSTANTS.DELETE_REPORTED_COMMENTS,
      method: "DELETE",
      data: {
        comment_ids: commentIds,
      },
    })
      .unwrap()
      .then((deleteReportedCommentsRes) => {
        dispatch(
          showToastMessage({
            message: deleteReportedCommentsRes?.message,
            severity: "success",
          }),
        );
        getReportedComments();
        fetchReportReasons();
      })
      .catch((deleteReportedCommentsErr) => {
        dispatch(
          showToastMessage({
            message: deleteReportedCommentsErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  const handleIgnoreReportedComments = (commentIds: number[]) => {
    ignoreReportedComments({
      endpoint: API_CONSTANTS.IGNORE_REPORTED_COMMENTS,
      method: "POST",
      data: {
        comment_ids: commentIds,
      },
    })
      .unwrap()
      .then((ignoreReportedCommentsRes) => {
        dispatch(
          showToastMessage({
            message: ignoreReportedCommentsRes?.message,
            severity: "success",
          }),
        );
        getReportedComments();
        fetchReportReasons();
      })
      .catch((ignoreReportedCommentsErr) => {
        dispatch(
          showToastMessage({
            message: ignoreReportedCommentsErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  useEffect(() => {
    getReportedComments();
  }, [page, rowsPerPage, searchText, reasonTabValue]);

  // Sync tab index with updated report reasons
  useEffect(() => {
    // Find index for the current active tab
    const currentTabIndex = reasonTabValue
      ? reportReasonsList.findIndex(
          (item) => item.reason_id === reasonTabValue,
        ) + 1
      : 0;

    // If active tab is invalid, reset to "All"
    if (currentTabIndex === -1) {
      setReasonTabValue(0);
      setReasonTabIndex(0);
    } else {
      setReasonTabIndex(currentTabIndex);
    }
  }, [reportReasonsList, reasonTabValue]);

  return (
    <div className="relative pt-5.5">
      <PageMetaData title="Reported Comments" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Manage Community",
            path: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
            icon: (
              <ForumOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Reported Comments" },
        ]}
      />
      <Box>
        <Box className="mb-6 !border-b">
          <Tabs
            value={reasonTabIndex}
            onChange={handleChangeReportedReasonTab}
            aria-label="report comments tab"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              ".MuiTabs-scrollButtons": {
                width: "auto",
                p: 0.8,
              },
              ".MuiTabs-scrollButtons.Mui-disabled": {
                display: "none",
              },
            }}
          >
            <Tab label="All" {...allProps(0)} disableRipple />
            {reportReasonsList?.map((item, index) => {
              return (
                <Tab
                  key={item.reason_id}
                  label={`${item.reason} (${item.report_count})`}
                  {...allProps(index + 1)}
                  disableRipple
                />
              );
            })}
          </Tabs>
        </Box>
        <ReportedCommentsComponent
          reportedCommentsData={reportedCommentsData}
          reportedCommentObj={reportedCommentObj}
          handlePageChange={handlePageChange}
          handleRowsPerPageChange={handleRowsPerPageChange}
          handleSearchText={handleSearchText}
          searchText={searchText}
          page={page}
          rowsPerPage={rowsPerPage}
          handleDeleteReportedComments={handleDeleteReportedComments}
          handleIgnoreReportedComments={handleIgnoreReportedComments}
          loading={apiLoading}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </Box>
    </div>
  );
};

export default ReportedCommentsPage;
