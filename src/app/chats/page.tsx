"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageComponent from "@/components/Chats/MessageComponent";
import { ChannelProvider } from "ably/react";
import {
  useAddMembersToGroupMutation,
  useDeleteGroupMutation,
  useDeleteMessageMutation,
  useLazyGetChatHistoryQuery,
  useLazyGetGroupDetailsByIdQuery,
  useSendMessageMutation,
} from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import {
  ChatHistoryDataProps,
  ChatHistoryProps,
  GroupDetailsByIdData,
  GroupDetailsByIdResponse,
  IndividualAccordionDetailsProps,
  IndividualMessageProps,
  InitialGroupDetailsValues,
  MessageSearchResponseProps,
} from "@/types/chats";
import ChatsHomePage from "@/components/Chats/ChatsHomePage";
import Loader from "@/components/common/Loader";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import { normalizeMessage } from "@/utils/normalizeMessage";
import { nanoid } from "nanoid";
import { toggleReloadChatHistory } from "@/redux/slices/chatSlice";
import MessageSearchResultsComponent from "@/components/Chats/MessageSearchResultsComponent";
import { getApiEndpointBasedOnType } from "@/utils/chatsReusableFunctions";

const ChatsHomeRenderPage = () => {
  const [sendMessage] = useSendMessageMutation();
  const [getChatHistory] = useLazyGetChatHistoryQuery();
  const [getGroupDetailsById] = useLazyGetGroupDetailsByIdQuery();
  const [deleteGroup] = useDeleteGroupMutation();
  const [leaveGroup] = useAddMembersToGroupMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [text, setText] = useState("");
  const [ablyChannelId, setAblyChannelId] = useState("");
  const [groupDetails, setGroupDetails] = useState<GroupDetailsByIdData>(
    InitialGroupDetailsValues,
  );
  const [chatHistory, setChatHistory] = useState<ChatHistoryDataProps[]>([]);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [showLoader, setShowLoader] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userAtBottom, setUserAtBottom] = useState(true);
  const [messages, setMessages] = useState<IndividualMessageProps[]>([]);
  const searchParams = useSearchParams();
  const messageType = searchParams.get("messageType") ?? "";
  const recipientId = searchParams.get("id") ?? "";
  const searchText = searchParams.get("messageSearch") ?? "";
  const searchedMessageId = searchParams.get("searchedMessageId") ?? "";
  const dispatch = useAppDispatch();
  const isChatCleared = useAppSelector((state) => state?.chat?.isChatCleared);
  const userCookies = useAppSelector(
    (state) => state?.cookies?.cookies?.userCookies,
  );
  const userId = userCookies?.user_id ?? 0;
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const contentLoaderRef = useRef<HTMLDivElement | null>(null);
  const [isReplyMessage, setIsReplyMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<
    IndividualMessageProps | undefined
  >();
  const [searchResults, setSearchResults] = useState<
    IndividualAccordionDetailsProps[]
  >([]);
  const [isSearchMessageLoading, setIsSearchMessageLoading] = useState(false);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const [searchHasMoreData, setSearchHasMoreData] = useState(true);
  const [searchPageNo, setSearchPageNo] = useState(1);
  const [profileImage, setProfileImage] = useState<string>("");
  const reloadChatHistory = useAppSelector(
    (state) => state?.chat?.reloadChatHistory,
  );
  const prevScrollHeightRef = useRef(0);

  const handleSendMessage = async () => {
    if (!text.trim()) return;
    const uniqueId = nanoid(8);
    const message = text;

    const tempMessage: IndividualMessageProps = {
      id: `temp-${userId}`,
      sender: {
        id: userId,
        name: userCookies?.full_name ?? "",
        profile_image: userCookies?.profile ?? "",
      },
      text: message,
      timestamp: Date.now(),
      uniqueId,
      parent_id: selectedMessage?.uniqueId ?? 0,
      parent_message: selectedMessage?.text ?? "",
      status: "Sending",
      type: messageType
    };

    setMessages((prev) =>
      prev.length === 0 ? [tempMessage] : [...prev, tempMessage],
    );

    setText("");
    setSelectedMessage(undefined);
    setIsReplyMessage(false);
    try {
      const res = await sendMessage({
        endpoint: API_CONSTANTS.SEND_MESSAGE,
        method: "POST",
        data: {
          recipient: Number(recipientId),
          message,
          chat_type: messageType,
          unique_id: uniqueId,
          parent_id: selectedMessage?.uniqueId ?? 0,
        },
      }).unwrap();

      setMessages((prev) => {
        return prev.map((msg) =>
          msg.uniqueId === tempMessage.uniqueId
            ? { ...msg, status: "", id: res.message_id, isError: false }
            : msg,
        );
      });

      if (res?.ably_channel_id) {
        setAblyChannelId(res.ably_channel_id);
      }
    } catch (error) {
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.uniqueId === tempMessage.uniqueId
            ? { ...msg, isError: true, status: "Failed" }
            : msg,
        );
      });
    }
  };

  const mergeUniqueContent = (
    prevList: ChatHistoryDataProps[],
    newList: ChatHistoryDataProps[],
    appendToBottom: boolean,
  ) => {
    const combinedData = appendToBottom
      ? [...newList, ...prevList]
      : [...prevList, ...newList];
    return Array.from(
      new Map(combinedData.map((item) => [item.unique_id, item])).values(),
    );
  };

  const handleGetChatHistory = useCallback(
    (page: number, appendToBottom: boolean) => {
      if (isChatHistoryLoading) return;
      setIsChatHistoryLoading(true);
      const queryParams = new URLSearchParams();
      if (messageType === "group") queryParams.set("group_id", recipientId);
      if (messageType === "private") queryParams.set("user_id", recipientId);
      if (messageType === "channel") queryParams.set("channel_id", recipientId);
      queryParams.set("page_size", "50");
      const currentPage = page;
      queryParams.set("page", String(currentPage));
      getChatHistory({
        endpoint: `${API_CONSTANTS.GET_CHAT_HISTORY}?${queryParams.toString()}`,
      })
        .unwrap()
        .then((res) => {
          const { results, next, user_profile_image } = res as ChatHistoryProps;
          setProfileImage(user_profile_image);
          const newContentData = results || [];
          setChatHistory((prev) =>
            mergeUniqueContent(prev, newContentData, appendToBottom),
          );
          setAblyChannelId(newContentData?.[0]?.ably_channel_name);
          if (!next) setHasMoreData(false);
          if (results?.length > 0 && next) {
            setPageNo(currentPage + 1);
          }
        })
        .catch((error) => {
          setChatHistory([]);
          dispatch(
            showToastMessage({
              message: error?.data?.message,
              severity: "error",
            }),
          );
        })
        .finally(() => {
          setIsChatHistoryLoading(false);
        });
    },
    [recipientId, getChatHistory, dispatch, messageType, pageNo],
  );

  const handleGetGroupDetailsById = useCallback(() => {
    setChatHistory([]);
    getGroupDetailsById({
      endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${recipientId}`,
    })
      .unwrap()
      .then((result) => {
        const { data } = result as GroupDetailsByIdResponse;
        setGroupDetails(data);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  }, [recipientId, dispatch, getGroupDetailsById]);

  useEffect(() => {
    if (recipientId && !searchText && !searchedMessageId) {
      setPageNo(1);
      setChatHistory([]);
      setAblyChannelId("");
      setHasMoreData(true);
      setShowLoader(true);
      setTimeout(() => {
        handleGetChatHistory(1, false);
      }, 0);
    }
  }, [recipientId, isChatCleared, handleGetChatHistory, searchText]);

  useEffect(() => {
    if (isChatHistoryLoading) {
      dispatch(toggleReloadChatHistory(false));
    } else if (
      reloadChatHistory &&
      searchParams?.size > 0 &&
      !ablyChannelId &&
      !searchText
    ) {
      setShowLoader(false);
      handleGetChatHistory(1, true);
    }
  }, [reloadChatHistory]);

  useEffect(() => {
    if (messageType === "group") {
      handleGetGroupDetailsById();
    }
  }, [messageType, recipientId, handleGetGroupDetailsById]);

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
              message: res?.data?.message || "Group deleted successfully",
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

  const handleLeaveGroup = (groupId: number) => {
    leaveGroup({
      endpoint: `${API_CONSTANTS.GET_GROUP_DETAILS_BY_ID}${groupId}/members?exit=true`,
      method: "DELETE",
    })
      .unwrap()
      .then((res) => {
        dispatch(
          showToastMessage({
            message: res?.message || "You have left the group",
            severity: "success",
          }),
        );
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
      });
  };

  useEffect(() => {
    if (chatHistory) {
      const reversedMessages = chatHistory?.toReversed();
      const normalizedMessages = reversedMessages?.map((msg) =>
        normalizeMessage(msg, "api"),
      );
      setMessages(normalizedMessages);
    }
  }, [chatHistory]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Determine if the user is near the bottom (within 50px).
    if (
      container.scrollHeight - container.scrollTop - container.clientHeight <
      50
    ) {
      setUserAtBottom(true);
    } else {
      setUserAtBottom(false);
    }

    // Trigger pagination if user is scrolled up beyond half the container height.
    prevScrollHeightRef.current = container.scrollHeight;
    if (
      !isChatHistoryLoading &&
      hasMoreData &&
      container.scrollTop <= container.clientHeight / 2
    ) {
      // Save the current scrollHeight so we can adjust later.
      handleGetChatHistory(pageNo, false);
    }
  }, [isChatHistoryLoading, hasMoreData, handleGetChatHistory]);

  useEffect(() => {
    if (searchedMessageId) {
      // Check if the target message is already in our messages list.
      const targetExists = messages.some(
        (msg) => msg.id === Number(searchedMessageId),
      );

      if (targetExists) {
        // Scroll to the target message. Assuming you render each message with an element id equal to msg.id.
        const targetElement = document.getElementById(searchedMessageId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (hasMoreData && !isChatHistoryLoading) {
        // If the target message isn't loaded yet and there's more data to load,
        // call the API to fetch older messages.
        handleGetChatHistory(pageNo, false);
      }
    }
  }, [messages, searchedMessageId, hasMoreData, isChatHistoryLoading]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // On the very first load (or for new messages coming in), scroll to bottom only if user is at bottom.
    if (isInitialLoad) {
      container.scrollTop = container.scrollHeight;
      setIsInitialLoad(false);
    } else {
      // If the API call was for pagination (prepending older messages),
      // adjust the scrollTop to maintain the user's current view.
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - prevScrollHeightRef.current;

      // If the user is not at bottom, maintain scroll position.
      // Otherwise, if the user is at bottom, scroll to the bottom.
      if (reloadChatHistory) {
        dispatch(toggleReloadChatHistory(false));
        container.scrollTop = container.scrollTop + scrollDiff;
      } else if (!userAtBottom) {
        container.scrollTop = container.scrollTop + scrollDiff;
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isInitialLoad, userAtBottom]);

  const mergeSearchUniqueContent = (
    prevList: IndividualAccordionDetailsProps[],
    newList: IndividualAccordionDetailsProps[],
  ) => {
    const combinedData = [...prevList, ...newList];
    return Array.from(
      new Map(combinedData.map((item) => [item.unique_id, item])).values(),
    );
  };

  const handlMessageSearch = (searchPage: number) => {
    if (isSearchMessageLoading) return;
    setIsSearchMessageLoading(true);
    const currentPage = searchPage;
    const queryParams = new URLSearchParams();
    if (messageType === "group") queryParams.set("group_id", recipientId);
    if (messageType === "private") queryParams.set("user_id", recipientId);
    if (messageType === "channel") queryParams.set("channel_id", recipientId);
    queryParams.set("search", searchText);
    queryParams.set("page_size", "10");
    queryParams.set("page", String(currentPage));
    getChatHistory({
      endpoint: `${API_CONSTANTS.GET_CHAT_HISTORY}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((res) => {
        const { results, count, next } = res as MessageSearchResponseProps;
        const newContentData = results || [];
        setSearchResults((prev) =>
          mergeSearchUniqueContent(prev, newContentData),
        );
        if (!next) setSearchHasMoreData(false);
        if (results?.length > 0 && next) {
          setSearchPageNo(currentPage + 1);
        }
        setSearchResultsCount(count);
      })
      .catch((error) => {
        dispatch(
          showToastMessage({
            message: error?.data?.message,
            severity: "error",
          }),
        );
        setSearchResultsCount(0);
      })
      .finally(() => {
        setIsSearchMessageLoading(false);
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          !isSearchMessageLoading &&
          searchHasMoreData
        ) {
          handlMessageSearch(searchPageNo);
        }
      },
      { threshold: 1.0 }, // Trigger only when fully visible
    );

    if (contentLoaderRef.current) {
      observer.observe(contentLoaderRef.current);
    }

    return () => {
      if (contentLoaderRef.current) {
        observer.unobserve(contentLoaderRef.current);
      }
    };
  }, [isSearchMessageLoading, searchHasMoreData, searchPageNo]);

  useEffect(() => {
    if (searchText) {
      setSearchPageNo(1);
      setSearchResults([]);
      setSearchResultsCount(0);
      setTimeout(() => {
        handlMessageSearch(1);
      }, 0);
    }
  }, [searchText]);

  const handleDeleteMessage = async (messageId: string) => {
    setMessages((prev) => {
      return prev.map((msg) =>
        msg.uniqueId === messageId ? { ...msg, status: "Deleting" } : msg,
      );
    });
    const endpoint = getApiEndpointBasedOnType(messageType);
    try {
      const res = await deleteMessage({
        endpoint: `${endpoint}${messageId}/delete/`,
        method: "DELETE",
      }).unwrap();
      if (res) {
        setMessages((prev) => prev.filter((m) => m.uniqueId !== messageId));
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.uniqueId === messageId
            ? { ...msg, status: "", isDeleted: false }
            : msg,
        );
      });
    }
  };

  return (
    <>
      {searchParams?.size === 0 ? (
        <ChatsHomePage userId={userId} />
      ) : (
        <>
          {searchText ? (
            <MessageSearchResultsComponent
              searchResults={[
                ...searchResults,
                ...Array(isSearchMessageLoading ? 10 : 0).fill(null),
              ]}
              isSearchMessageLoading={isSearchMessageLoading}
              userId={userId}
              searchResultsCount={searchResultsCount}
              contentLoaderRef={contentLoaderRef}
              messageType={messageType}
              recipientId={recipientId}
            />
          ) : (
            <ChannelProvider channelName={ablyChannelId}>
              <Suspense fallback={<Loader />}>
                <MessageComponent
                  text={text}
                  setText={setText}
                  handleSendMessage={handleSendMessage}
                  ablyChannelId={ablyChannelId}
                  groupDetails={groupDetails}
                  handleDeleteGroup={handleDeleteGroup}
                  handleLeaveGroup={handleLeaveGroup}
                  userId={userId}
                  messages={[
                    ...Array(isChatHistoryLoading && showLoader ? 12 : 0).fill(
                      null,
                    ),
                    ...messages,
                  ]}
                  setMessages={setMessages}
                  scrollContainerRef={scrollContainerRef}
                  handleScroll={handleScroll}
                  isReplyMessage={isReplyMessage}
                  setIsReplyMessage={setIsReplyMessage}
                  selectedMessage={selectedMessage}
                  setSelectedMessage={setSelectedMessage}
                  handleDeleteMessage={handleDeleteMessage}
                  profileImage={profileImage}
                />
              </Suspense>
            </ChannelProvider>
          )}
        </>
      )}
    </>
  );
};

const ChatsHomeWrapper = () => {
  return (
    <div className="flex w-full">
      <Suspense fallback={<Loader />}>
        <ChatsHomeRenderPage />
      </Suspense>
    </div>
  );
};

export default ChatsHomeWrapper;
