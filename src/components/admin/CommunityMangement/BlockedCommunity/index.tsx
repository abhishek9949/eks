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
  Block as BlockIcon,
} from "@mui/icons-material";
import clsx from "clsx";
import { useOrganizationList } from "@/hooks/useOrganizationList";
import {
  useLazyGetBlockedCommunityListQuery,
  useUnblockCommunityForumMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import Loader from "@/components/common/Loader";
import SingleBlockedCommunity from "./SingleBlockedCommunity";
import useDebounce from "@/hooks/useDebounce";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";
import {
  BlockedCommunityListType,
  BlockedCommunityOrgData,
} from "@/types/community/BlockedCommunityType";

const BlockedCommuinty = () => {
  const dispatch = useAppDispatch();
  const [getBlockedCommunityList] = useLazyGetBlockedCommunityListQuery();
  const [unblockCommunityForum] = useUnblockCommunityForumMutation();
  const { organizationList } = useOrganizationList();
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState(0);
  const [organisationName, setOrganisationName] = useState<number[] | null>(
    null,
  );
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const [blockedCommunityList, setBlockedCommunityList] = useState<
    BlockedCommunityListType[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [apiLoading, setApiLoading] = useState(true);

  // Fetch blocked content list
  const fetchBlockedCommunityList = () => {
    setApiLoading(true);
    const endpoint = `${API_CONSTANTS.GET_BLOCKED_COMMUNITY_FORUMS}/?page=${page}&search=${debouncedSearchText}&organisation_name=${JSON.stringify(organisationName)}`;

    getBlockedCommunityList({
      endpoint,
    })
      .unwrap()
      .then((response) => {
        const { results = [], count } = response?.data as {
          results: BlockedCommunityListType[];
          count: number;
        };
        setPageCount(Math.ceil(count / 5));
        setBlockedCommunityList(results || []);
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
    fetchBlockedCommunityList();
  }, [page, organisationName, debouncedSearchText]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(Number(newPage));
  };

  const handleSelectAll = (items: BlockedCommunityOrgData[]) => {
    if (
      items.every((element: any) =>
        selectedItems.includes(element.blocked_community_id),
      )
    ) {
      setSelectedItems(
        selectedItems.filter(
          (item) => !items.some((block) => block.blocked_community_id === item),
        ),
      ); // Unselect all
    } else {
      setSelectedItems([
        ...selectedItems,
        ...items.map((item) => item.blocked_community_id),
      ]); // Select all
    }
  };

  const handleUnblockContent = () => {
    unblockCommunityForum({
      endpoint: API_CONSTANTS.UNBLOCK_COMMUNITY_FORUM,
      method: "PUT",
      data: {
        forum_id: selectedItems,
        status: 1,
      },
    })
      .unwrap()
      .then((result) => {
        const { message } = result as { message: string };
        if (result) {
          setSelectedItems([]);
          dispatch(showToastMessage({ message: message, severity: "success" }));
          fetchBlockedCommunityList();
        }
      })
      .catch((error) => {
        setSelectedItems([]);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  return (
    <div className="pt-5.5">
      <div className="grid grid-cols-5 gap-0">
        <div className="col-span-3">
          <BreadcrumbComponent
            levels={[
              {
                name: "Manage Community",
                path: URL_CONSTANTS.ADMIN_COMMUNITY_LIST,
                icon: (
                  <MenuBookOutlined className="align-center flex h-4 w-4 text-gray-8" />
                ),
              },
              { name: "Blocked Community" },
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
          {blockedCommunityList.length ? (
            blockedCommunityList?.map(
              (item: BlockedCommunityListType, index: number) => (
                <BoxCont
                  key={`block-${index}-${item.community_id}`}
                  className="mt-5"
                >
                  <SingleBlockedCommunity
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

export default BlockedCommuinty;
