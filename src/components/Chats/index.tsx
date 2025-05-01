"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Add, FilterAltOutlined } from "@mui/icons-material";
import { Button, Theme, useMediaQuery } from "@mui/material";
import IndividualAccordion from "./IndividualAccordionComponent";
import NewChatPopup from "./NewChatPopup";
import NewGroupPopup from "./NewGroupPopup";
import ChatFilter from "./ChatFilter";
import {
  useClearGroupChatMutation,
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useLazyGetGlobalChatHistoryQuery,
  useLazySearchGlobalChatDetailsQuery,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  ChatMainComponentProps,
  CreateGroupValuesProps,
  GlobalChatHistoryDataProps,
  GlobalChatHistoryResponseProps,
  IndividualAccordionDetailsProps,
  InitialGlobalChatHistoryDataValues,
  SearchedGlobalChatDetailsResponse,
} from "@/types/chats";
import { toggleIsChatCleared, toggleReloadChatHistory } from "@/redux/slices/chatSlice";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { useRouter, useSearchParams } from "next/navigation";
import { GlobalUsersList } from "@/types/user";
import Loader from "@/components/common/Loader";

const Chats = ({ setSidebarOpen }: ChatMainComponentProps) => {
  const [isNewChatPopupOpen, setIsNewChatPopupOpen] = useState(false);
  const [isNewGroupPopupOpen, setIsNewGroupPopupOpen] = useState(false);
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [searchGlobalChatDetails] = useLazySearchGlobalChatDetailsQuery();
  const [getGlobalChatHistory] = useLazyGetGlobalChatHistoryQuery();
  const [createNewGroup] = useCreateGroupMutation();
  const [clearGroupChat] = useClearGroupChatMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [searchedGlobalChatDetailsResult, setSearchedGlobalChatDetailsResult] =
    useState<SearchedGlobalChatDetailsResponse[]>([]);
  const [isSearchGlobalChatDetailLoading, setIsSearchGlobalChatDetailLoading] =
    useState(false);
  const [globalChatHistory, setGlobalChatHistory] =
    useState<GlobalChatHistoryDataProps>(InitialGlobalChatHistoryDataValues);
  const [isGlobalChatHistoryLoading, setIsGlobalChatHistoryLoading] =
    useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const userId =
    useAppSelector((state) => state.cookies.cookies.userCookies?.user_id) ?? 0;
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const messageType = searchParams.get("messageType");
  const isLaptop = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const getSearchGlobalChatDetails = useCallback(
    (searchText: string) => {
      setIsSearchGlobalChatDetailLoading(true);
      searchGlobalChatDetails({
        endpoint: `${API_CONSTANTS.SEARCH_GLOBAL_CHAT_DETAILS}?query_text=${searchText}`,
      })
        .unwrap()
        .then((res) => {
          setSearchedGlobalChatDetailsResult(
            res as SearchedGlobalChatDetailsResponse[],
          );
        })
        .catch((error) => {
          dispatch(
            showToastMessage({
              message: error?.data?.error,
              severity: "error",
            }),
          );
        })
        .finally(() => {
          setIsSearchGlobalChatDetailLoading(false);
        });
    },
    [dispatch, searchGlobalChatDetails],
  );

  const getFieldDataToCheckReload = (data: GlobalChatHistoryDataProps) => {
    if (messageType === "private") return data?.private_chats;
    if (messageType === "group") return data?.group_chats;
    if (messageType === "channel") return data?.channel_chats;
  }

  const checkIsReload = (data: GlobalChatHistoryDataProps) => {
    const chatData = getFieldDataToCheckReload(data);
    return chatData?.some((chat: IndividualAccordionDetailsProps) => chat?.sender?.user_id === Number(id) && chat?.unread_count > 0);
  };

  const handleGetGlobalChatHistory = useCallback((isFirst: boolean) => {
    if (isFirst) setIsGlobalChatHistoryLoading(true);
    getGlobalChatHistory({
      endpoint: `${API_CONSTANTS.GET_GLOBAL_CHAT_HISTORY}?group_by=true`,
    })
      .unwrap()
      .then((res) => {
        const { data } = res as GlobalChatHistoryResponseProps;
        const isReload = checkIsReload(data);
        if (isReload) dispatch(toggleReloadChatHistory(true));
        setGlobalChatHistory(data);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      })
      .finally(() => {
        setIsGlobalChatHistoryLoading(false);
      });
  }, [dispatch, getGlobalChatHistory]);

  useEffect(() => {
    handleGetGlobalChatHistory(true);
  
    const intervalId = setInterval(() => {
      handleGetGlobalChatHistory(false);
    }, 10000);
  
    return () => clearInterval(intervalId);
  }, [handleGetGlobalChatHistory]);

  const toggleNewGroupPopup = () => {
    setIsNewChatPopupOpen(false);
    setIsNewGroupPopupOpen(!isNewGroupPopupOpen);
  };

  const handleOnClickNewChat = () => {
    setSearchedGlobalChatDetailsResult([]);
    setIsNewChatPopupOpen(!isNewChatPopupOpen);
    setIsFilterPopupOpen(false);
  };

  const toggleNewChatPopup = () => {
    toggleSidebar();
    setSearchedGlobalChatDetailsResult([]);
    setIsNewChatPopupOpen(!isNewChatPopupOpen);
  };

  const handleOnClickFilter = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
    setIsNewChatPopupOpen(false);
  };

  const handleCreateGroup = (values: CreateGroupValuesProps) => {
    const data = {
      group_name: values?.groupName,
      members: values?.peopleSelected?.map(
        (member: GlobalUsersList) => member?.user_id,
      ),
      is_public: false,
    };
    createNewGroup({
      endpoint: API_CONSTANTS.CREATE_GROUP,
      method: "POST",
      data,
    })
      .unwrap()
      .then((res) => {
        router.replace(
          `${URL_CONSTANTS.CHATS}?title=${values?.groupName}&messageType=group&id=${res?.group_id}`,
        );
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      })
      .finally(() => {
        toggleNewGroupPopup();
      });
  };

  const handleClearGroupChat = (groupId: number) => {
    clearGroupChat({
      endpoint: `${API_CONSTANTS.CLEAR_GROUP_CHAT}${groupId}`,
      method: "DELETE",
    })
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            showToastMessage({
              message: "Chat cleared succesfully",
              severity: "success",
            }),
          );
          if (groupId === Number(id)) {
            dispatch(toggleIsChatCleared(true));
          }
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

  const handleDeleteGroup = (groupId: number) => {
    deleteGroup({
      endpoint: `${API_CONSTANTS.DELETE_GROUP}${groupId}`,
      method: "DELETE",
    })
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            showToastMessage({
              message: "Group deleted successfully",
              severity: "success",
            }),
          );
          router.replace(URL_CONSTANTS.CHATS);
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

  const toggleSidebar = () => {
    if (!isLaptop) setSidebarOpen(false);
  }

  return (
    <div className="flex flex-col pt-2">
      <div className="relative">
        <div className="grid grid-cols-12 gap-2">
          <Button
            className="col-span-9 flex items-center justify-center gap-2 !border !border-solid !border-primary px-8"
            onClick={handleOnClickNewChat}
          >
            <Add className="text-primary" />
            <p className="text-lg font-medium text-primary">New</p>
          </Button>
          <Button
            className="!border !border-solid !border-primary"
            onClick={handleOnClickFilter}
          >
            <FilterAltOutlined className="text-black" />
          </Button>
        </div>
        {isNewChatPopupOpen && (
          <NewChatPopup
            handleOnClickCreateGroup={toggleNewGroupPopup}
            getSearchGlobalChatDetails={getSearchGlobalChatDetails}
            searchedGlobalChatDetailsResult={searchedGlobalChatDetailsResult}
            toggleNewChatPopup={toggleNewChatPopup}
            isSearchGlobalChatDetailLoading={isSearchGlobalChatDetailLoading}
            userId={userId}
          />
        )}
        {isFilterPopupOpen && (
          <ChatFilter handleCloseFilter={handleOnClickFilter} />
        )}
      </div>
      {globalChatHistory?.group_chats?.length > 0 && (
        <IndividualAccordion
          title="Groups"
          details={globalChatHistory?.group_chats}
          type="group"
          handleClearGroupChat={handleClearGroupChat}
          handleDeleteGroup={handleDeleteGroup}
          userId={userId}
          isGlobalChatHistoryLoading={isGlobalChatHistoryLoading}
          toggleSidebar={toggleSidebar}
        />
      )}
      {globalChatHistory?.private_chats?.length > 0 && (
        <IndividualAccordion
          title="Direct messages"
          details={globalChatHistory?.private_chats}
          type="private"
          userId={userId}
          isGlobalChatHistoryLoading={isGlobalChatHistoryLoading}
          toggleSidebar={toggleSidebar}
        />
      )}
      {globalChatHistory?.channel_chats?.length > 0 && (
        <IndividualAccordion
          title="Channels"
          details={globalChatHistory?.channel_chats}
          type="channel"
          userId={userId}
          isGlobalChatHistoryLoading={isGlobalChatHistoryLoading}
          toggleSidebar={toggleSidebar}
        />
      )}
      {isNewGroupPopupOpen && (
        <NewGroupPopup
          openNewGroupPopup={isNewGroupPopupOpen}
          handleCloseNewGroupPopup={toggleNewGroupPopup}
          handleCreateGroup={handleCreateGroup}
        />
      )}
    </div>
  );
};

const ChatsWrapper = ({ setSidebarOpen }: ChatMainComponentProps) => {
  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      <Suspense fallback={<Loader />}>
        <Chats setSidebarOpen={setSidebarOpen} />
      </Suspense>
    </div>
  );
};

export default ChatsWrapper;
