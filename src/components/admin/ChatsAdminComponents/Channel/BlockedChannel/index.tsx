"use client";

import React, { useEffect, useState } from "react";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  Box as BoxCont,
  Button,
  FormControl,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  Paper,
} from "@mui/material";
import {
  Search,
  MenuBookOutlined,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Block as BlockIcon,
} from "@mui/icons-material";
import clsx from "clsx";
import { useOrganizationList } from "@/hooks/useOrganizationList";
import {
  useLazyGetBlockedChannelQuery,
  useUnblockChannelMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import Loader from "@/components/common/Loader";
import SingleBlockedChannel from "./SingleBlockedChannel";
import useDebounce from "@/hooks/useDebounce";
import {
  BlockedChannelListType,
  BlockedChannelOrgData,
} from "@/types/chatAdminTypes";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";

const BlockedChannelComp = () => {
  const dispatch = useAppDispatch();
  const [getBlockedChannel] = useLazyGetBlockedChannelQuery();
  const [unblockChannel] = useUnblockChannelMutation();
  const { organizationList } = useOrganizationList();
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState(0);
  const [organisationName, setOrganisationName] = useState<number[] | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [blockedChannelList, setBlockedChannelList] = useState<
    BlockedChannelListType[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  // Fetch blocked content list
  const fetchBlockedChannelList = () => {
    setApiLoading(true);
    const endpoint = `${API_CONSTANTS.GET_BLOCKED_CHANNEL}/?page=${page}&search=${debouncedSearchText}&organisation_name=${JSON.stringify(organisationName)}`;

    getBlockedChannel({
      endpoint,
    })
      .unwrap()
      .then((response) => {
        const { results = [], count } = response?.data as {
          results: BlockedChannelListType[];
          count: number;
        };
        setPageCount(Math.ceil(count / 5));
        setBlockedChannelList(results || []);
        setApiLoading(false);
      })
      .catch((error) => {
        setApiLoading(false);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    fetchBlockedChannelList();
  }, [page, organisationName, debouncedSearchText]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const handleSelectAll = (items: BlockedChannelOrgData[]) => {
    if (
      items.every((element: any) =>
        selectedItems.includes(element.blocked_channel_id),
      )
    ) {
      setSelectedItems(
        selectedItems.filter(
          (item) => !items.some((block) => block.blocked_channel_id === item),
        ),
      ); // Unselect all
    } else {
      setSelectedItems([
        ...selectedItems,
        ...items.map((item) => item.blocked_channel_id),
      ]); // Select all
    }
  };

  const handleUnblockContent = () => {
    unblockChannel({
      endpoint: API_CONSTANTS.UNBLOCK_CHANNEL,
      method: "PUT",
      data: {
        channel_id: selectedItems,
        status: 1,
      },
    })
      .unwrap()
      .then((result) => {
        const { message } = result as { message: string };
        if (result) {
          setSelectedItems([]);
          dispatch(showToastMessage({ message: message, severity: "success" }));
          fetchBlockedChannelList();
        }
      })
      .catch((error) => {
        setSelectedItems([]);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  console.log(organisationName);

  return (
    <div className="pt-5.5">
      <div className="grid grid-cols-5 gap-0">
        <div className="col-span-3">
          <BreadcrumbComponent
            levels={[
              {
                name: "Chats",
                path: URL_CONSTANTS.ADMIN_CHAT_MANAGEMENT,
                icon: (
                  <MenuBookOutlined className="align-center flex h-4 w-4 text-gray-8" />
                ),
              },
              { name: "Blocked Channel" },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-4">
          <BoxCont className="flex flex-1 flex-col">
            <FormControl>
              <MultiSelectDropdown
                id="Origanation"
                size="small"
                value={
                  organisationName
                    ?.map((id) => {
                      const org = organizationList.find(
                        (org) => org.organisation_id === id,
                      );
                      return org
                        ? {
                            id: org.organisation_id,
                            label: org.organisation_name,
                          }
                        : null;
                    })
                    .filter(
                      (org): org is { id: number; label: string } =>
                        org !== null,
                    ) || []
                }
                onChange={(selectedIds: { id: number; label: string }[]) => {
                  setOrganisationName(
                    selectedIds.length
                      ? selectedIds.map((item) => item.id)
                      : null,
                  );
                  setPage(1);
                }}
                options={organizationList.map((org) => ({
                  label: org.organisation_name,
                  id: org.organisation_id,
                }))}
                placeholder="Search organizations"
              />
            </FormControl>
          </BoxCont>
        </div>

        <div className="col-span-3">
          <TextField
            id="search-title"
            className={clsx("mb-4 me-4 w-full")}
            placeholder="Search..."
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              },
            }}
          />
        </div>

        <div className={clsx("col-span-2 col-start-11", "!flex !justify-end")}>
          <Button
            className="!flex !h-10 cursor-pointer"
            variant="contained"
            disabled={selectedItems.length === 0}
            onClick={() => handleUnblockContent()}
            disableRipple
            size="medium"
          >
            <BlockIcon className="mr-1" /> Unblock
          </Button>
        </div>
      </div>
      {apiLoading ? (
        <Loader />
      ) : (
        <>
          {blockedChannelList.length ? (
            blockedChannelList?.map(
              (item: BlockedChannelListType, index: number) => (
                <BoxCont
                  key={`block-${index}-${item.channel_id}`}
                  className="mt-5"
                >
                  <SingleBlockedChannel
                    {...item}
                    selectedItems={selectedItems}
                    onSelect={setSelectedItems}
                    items={item.organisation_name}
                    handleSelectAll={handleSelectAll}
                  />
                </BoxCont>
              ),
            )
          ) : (
            <Paper className="!mt-5 p-5">No data available</Paper>
          )}
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
        </>
      )}
    </div>
  );
};

export default BlockedChannelComp;
