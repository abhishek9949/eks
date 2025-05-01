"use client";

import React, { useEffect, useState } from "react";
import { BreadcrumbComponent } from "@/components/common/DynamicImports";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import {
  Box,
  Button,
  FormControl,
  TextField,
  InputAdornment,
  Collapse,
  MenuItem,
  Pagination,
  Select,
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
import ExpandableToggle from "@/components/ToggleList";
import { useOrganizationList } from "@/hooks/useOrganizationList";
import {
  useLazyGetBlockedContentListQuery,
  useUnblockContentMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  BlockedContentList,
  UseCategoryListResponse,
} from "@/types/content";
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/common/Loader";
import MultiSelectDropdown from "@/components/common/MultiSelectCategory";
import { useCategoryList } from "@/hooks/useCategoryList";
import { ContentTypeArray } from "@/constants/contentTypets";
import useDebounce from "@/hooks/useDebounce";
import { PERMISSIONS } from "@/constants/permissionsNames";
import { checkPermissionExists } from "@/utils/permissionFormate";

interface OrganisationList {
  organisation_id: number;
  organisation_name: string;
}

const ContentBlockList = () => {
  const searchParams = useSearchParams();
  const { organizationList } = useOrganizationList();
  const [page, setPage] = useState<number>(
    Number(searchParams.get("page")) || 1,
  );
  const [pageCount, setPageCount] = useState(0);
  const [isExpandedAdvanceSearch, setIsExpandedAdvanceSearch] = useState(false);
  const [getBlockedContentListApi] = useLazyGetBlockedContentListQuery();
  const [unblockContent] = useUnblockContentMutation();
  const [contentList, setContentList] = useState<BlockedContentList[] | []>([]);
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const isAdmin =
    useAppSelector(
      (state) => state.cookies.cookies.userCookies?.organization_id,
    ) === 0;
  const [apiLoading, setApiLoading] = useState(true);
  const { updateSearchParams } = useUpdateSearchParams();
  const { categoryList = [] }: UseCategoryListResponse =
    useCategoryList("content");
  const { cookies } = useAppSelector((state) => state.cookies);
  const permissions = cookies?.permissionCookie || [];

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author_name") ?? "",
  );
  const debouncedAuthor = useDebounce(authorInput, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      updateSearchParams({ search: debouncedSearchTerm });
    } else {
      updateSearchParams({ search: null });
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedAuthor) {
      updateSearchParams({ author_name: debouncedAuthor });
    } else {
      updateSearchParams({ author_name: null });
    }
  }, [debouncedAuthor]);

  // Fetch blocked content list
  const fetchBlockedContentList = () => {
    setApiLoading(true);
    // Extract URL parameters
    const organisationIds = searchParams.get("organisation_name") ?? "";
    const searchQuery = searchParams.get("search") ?? "";
    const pageNo = searchParams.get("page") ?? "";
    const category_id = searchParams.get("category_id") ?? "";
    const type = searchParams.get("type") ?? "";
    const author_name = searchParams.get("author_name") ?? "";

    const queryParams = new URLSearchParams();

    //  Add parameters only if they have values
    if (pageNo) queryParams.set("page", pageNo);
    if (organisationIds) queryParams.set("organisation_name", organisationIds);
    if (searchQuery) queryParams.set("search", searchQuery);
    if (type) queryParams.set("type", type);
    if (author_name) queryParams.set("author_name", author_name);
    if (category_id) queryParams.set("category_id", category_id);

    // Construct the final endpoint URL
    const endpoint = `${API_CONSTANTS.GET_BLOCKED_CONTENT_LIST}?${queryParams.toString()}`;

    getBlockedContentListApi({
      endpoint,
    })
      .unwrap()
      .then((response) => {
        const { results = [], count } = response as {
          results: BlockedContentList[];
          count: number;
        };
        setPageCount(Math.ceil(count / 5));
        setContentList(results || []);
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
    fetchBlockedContentList();
  }, [searchParams]);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    updateSearchParams({ page: newPage as unknown as string });
    setPage(Number(newPage));
  };

  const handleSelectAll = (
    items: {
      blocked_content_id: number;
      organisation_id: null;
      organisation_name: string | null;
    }[],
  ) => {
    if (
      items.every((element: any) =>
        selectedItems.includes(element.blocked_content_id),
      )
    ) {
      setSelectedItems(
        selectedItems.filter(
          (item) => !items.some((block) => block.blocked_content_id === item),
        ),
      ); // Unselect all
    } else {
      setSelectedItems([
        ...selectedItems,
        ...items.map((item) => item.blocked_content_id),
      ]); // Select all
    }
  };

  const handleUnblockContent = () => {
    unblockContent({
      endpoint: API_CONSTANTS.UNBLOCKED_CONTENT,
      method: "PUT",
      data: {
        id: selectedItems,
        status: 1,
      },
    })
      .unwrap()
      .then((result) => {
        const { message } = result as { message: string };
        if (result) {
          setSelectedItems([]);
          dispatch(showToastMessage({ message: message, severity: "success" }));
          fetchBlockedContentList();
        }
      })
      .catch((error) => {
        setSelectedItems([]);
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  // Handle organisation change
  const handleOrgChange = (newValue: { id: number; label: string }[]) => {
    const ids = newValue.map((org) => org.id);
    if (ids.length === 0) {
      updateSearchParams({ organisation_name: null, page: "1" as string });
    } else {
      updateSearchParams({
        organisation_name: ids as unknown as string[],
        page: "1" as string,
      });
    }
  };

  // Handle category change
  const handleCategoryChange = (newValue: { id: number; label: string }[]) => {
    const ids = newValue.map((cat) => cat.id) as unknown as string[];
    if (ids.length === 0) {
      updateSearchParams({ category_id: null, page: "1" as string });
    } else {
      updateSearchParams({ category_id: ids, page: "1" as string });
    }
  };

  // Handle category change
  const clearFileter = () => {
    updateSearchParams({
      category_id: null,
      page: null,
      organisation_name: null,
      type: null,
      search: null,
      author_name: null,
    });
    setSearchTerm("");
    setAuthorInput("");
  };

  return (
    <div className="pt-5.5">
      <div className="grid grid-cols-5 gap-0">
        <div className="col-span-3">
          <BreadcrumbComponent
            levels={[
              {
                name: "Manage Content",
                path: URL_CONSTANTS.ADMIN_CONTENT_LIST,
                icon: (
                  <MenuBookOutlined className="align-center flex h-4 w-4 text-gray-8" />
                ),
              },
              { name: "Blocked Content" },
            ]}
          />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {isAdmin && (
          <div className="col-span-4">
            <Box className="flex flex-1 flex-col">
              <FormControl>
                <MultiSelectDropdown
                  id="organization"
                  size="small"
                  value={organizationList
                    .filter((org) => {
                      const selectedOrgIdArray = JSON.parse(searchParams.get("organisation_name") ?? "[]");
                      return selectedOrgIdArray.includes(org.organisation_id);
                    })
                    .map((org) => ({
                      id: org.organisation_id,
                      label: org.organisation_name
                    }))}
                  onChange={handleOrgChange}
                  options={organizationList.map((org) => ({
                    label: org.organisation_name,
                    id: org.organisation_id,
                  }))}
                  placeholder="Search organizations"
                />
              </FormControl>
            </Box>
          </div>
        )}
        <div className="col-span-3">
          <TextField
            id="search-title"
            className={clsx("mb-4 me-4 w-full")}
            placeholder="Search by content title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value ?? "")} // Update state instantly
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
        <div className="col-span-3">
          <Button
            className="cursor-pointer"
            onClick={() => {
              setIsExpandedAdvanceSearch(!isExpandedAdvanceSearch);
            }}
          >
            Advanced Search
          </Button>
        </div>
        {checkPermissionExists(
          PERMISSIONS.CONTENT_MANAGEMENT.UNBLOCK,
          permissions,
        ) && (
          <div
            className={clsx(
              isAdmin ? "col-span-2" : "col-span-2 col-start-11",
              "!flex !justify-end",
            )}
          >
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
        )}
      </div>
      <Collapse in={isExpandedAdvanceSearch} timeout={300}>
        <div className="mt-2 grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <MultiSelectDropdown
              id="category"
              size="small"
              value={categoryList
                .filter((cat) => {
                  const selectedCatIdArray = JSON.parse(searchParams.get("category_id") ?? "[]");
                  return selectedCatIdArray.includes(cat.category_id);
                })
                .map((cat) => ({
                  id: cat.category_id,
                  label: cat.name
                }))}
              onChange={handleCategoryChange}
              options={categoryList.map((cat) => ({
                label: cat.name,
                id: cat.category_id,
              }))}
              placeholder="Choose categories"
            />
          </div>
          <div className="col-span-3">
            <TextField
              id="author_name"
              className={clsx("mb-4 me-4 w-full")}
              placeholder="Search by Author name"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
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
          <div className="col-span-2">
            <Select
              id="content_type"
              name="content_type"
              fullWidth
              value={searchParams.get("type") ?? ""}
              size="small"
              displayEmpty
              onChange={(e) => updateSearchParams({ type: e.target.value })}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return (
                    <span className="!text-gray-16 ">Choose Content Type</span>
                  );
                }
                return selected;
              }}
            >
              {ContentTypeArray.slice(1).map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className="col-start-12 col-span-1 !flex !justify-end">
            <Button
              variant="contained"
              className="!h-10 cursor-pointer"
              onClick={() => clearFileter()}
              disableRipple
            >
              Reset
            </Button>
          </div>
        </div>
      </Collapse>
      {apiLoading ? (
        <Loader />
      ) : (
        <>
          {contentList.length ? (
            contentList?.map((item: any, index: number) => (
              <Box key={`block-${index}-${item.content_id}`} className="mt-5">
                <ExpandableToggle
                  {...item}
                  selectedItems={selectedItems}
                  onSelect={setSelectedItems}
                  items={item.organisation_name}
                  handleSelectAll={handleSelectAll}
                  isAdmin={isAdmin}
                  createdBy={item?.author_name}
                />
              </Box>
            ))
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

export default ContentBlockList;
