"use client";

import React, { useEffect, useState } from "react";
import ChannelList from "@/components/admin/ChatsAdminComponents/Channel/View/ChannelList";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import PageMetaData from "@/components/common/PageMetaData";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import {
  useBlockChannelMutation,
  useDeleteChannelMutation,
  useLazyGetChannelListQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { ChannelListResType, ChannelListType } from "@/types/chatAdminTypes";
import useDebounce from "@/hooks/useDebounce";

const ChannelListComp = () => {
  const dispatch = useAppDispatch();
  const [getChannelList] = useLazyGetChannelListQuery();
  const [deleteChannel] = useDeleteChannelMutation();
  const [blockChannel] = useBlockChannelMutation();
  const [apiLoading, setApiLoading] = useState(false);
  const [channelsResObj, setChannelsResObj] = useState<ChannelListResType>();
  const [channelsData, setChannelsData] = useState<ChannelListType[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [sortColumn, setSortColumn] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const debouncedSearchText = useDebounce(searchText, 500);

  const handlePageChange = (
    event: React.MouseEvent | null,
    newPage: number,
  ) => {
    setPage(newPage + 1);
  };
  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleSortChange = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
    setPage(1);
  };

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleBlockChannel = (
    channel_ids: number[],
    organisation_ids: (string | number)[],
  ) => {
    blockChannel({
      endpoint: `${API_CONSTANTS.BLOCK_CHANNEL}`,
      method: "POST",
      data: {
        channel_ids,
        recipient_id: organisation_ids,
      },
    })
      .unwrap()
      .then((blockChannelRes) => {
        dispatch(
          showToastMessage({
            message: blockChannelRes?.message,
            severity: "success",
          }),
        );
        handleGetChannelList();
      })
      .catch((blockChannelErr) => {
        dispatch(
          showToastMessage({
            message: blockChannelErr?.data?.message,
            severity: "error",
          }),
        );
      });
  };

  const handleDeleteChannel = (id: number) => {
    deleteChannel({
      endpoint: `${API_CONSTANTS.DELETE_CHANNEL}/${id}`,
      method: "DELETE",
      data: {},
    })
      .unwrap()
      .then((deleteChannelRes) => {
        dispatch(
          showToastMessage({
            message: deleteChannelRes?.message,
            severity: "success",
          }),
        );
        handleGetChannelList();
      })
      .catch((deleteChannelErr) => {
        dispatch(
          showToastMessage({
            message: deleteChannelErr?.data?.error,
            severity: "error",
          }),
        );
      });
  };

  const handleGetChannelList = () => {
    setApiLoading(true);
    getChannelList({
      endpoint: `${API_CONSTANTS.GET_CHANNEL_LIST}/?page=${page}&page_size=${rowsPerPage}&sort_by=${sortColumn}&sort_order=${sortDirection}&search=${debouncedSearchText}`,
    })
      .unwrap()
      .then((getChannelsRes) => {
        setChannelsResObj(getChannelsRes);
        const updatedChannelData = getChannelsRes?.data?.results?.map(
          (channel) => ({
            ...channel,
            id: channel.channel_id,
          }),
        );
        setChannelsData(updatedChannelData);
        setApiLoading(false);
      })
      .catch((getChannelsErr) => {
        dispatch(
          showToastMessage({
            message: getChannelsErr?.data?.error,
            severity: "error",
          }),
        );
        setApiLoading(false);
      });
  };

  useEffect(() => {
    handleGetChannelList();
  }, [page, rowsPerPage, sortColumn, sortDirection, debouncedSearchText]);

  return (
    <div className="relative">
      <PageMetaData title="Channel List" />
      <BreadcrumbComponent
        levels={[
          {
            name: "Chats",
            path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
            icon: (
              <ChatOutlinedIcon className="align-center flex h-4 w-4 text-gray-8" />
            ),
          },
          { name: "Channel List" },
        ]}
      />
      <Box className="absolute end-0 top-0 z-1">
        <Link href={URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT_CREATE_CHANNEL}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disableRipple
            sx={{ backgroundColor: "primary.main" }}
          >
            New Channel
          </Button>
        </Link>
      </Box>
      <ChannelList
        isLoading={apiLoading}
        channelsResObj={channelsResObj}
        channelsData={channelsData}
        handleDeleteChannel={handleDeleteChannel}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        handleBlockChannel={handleBlockChannel}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        handleSearchText={handleSearchText}
        searchText={searchText}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSortChange={handleSortChange}
      />
    </div>
  );
};

export default ChannelListComp;
