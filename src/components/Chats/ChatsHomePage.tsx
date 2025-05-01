"use client";
import React, { useEffect, useRef, useState } from "react";
import SearchGlobalChatDetailSkeleton from "./SearchGlobalChatDetailSkeleton";
import {
  getNameAndIdBasedOnType,
} from "@/utils/chatsReusableFunctions";
import {
  formatTimestamp,
} from "@/utils/reusableFunctions";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import ChatDefaultScreen from "./ChatDefaultScreen";
import {
  ChatHomePageProps,
  IndividualAccordionDetailsProps,
  RecentMessagesResponseProps,
} from "@/types/chats";
import { useLazyGetGlobalChatHistoryQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { showToastMessage } from "@/redux/slices/toastMessageSlice";
import clsx from "clsx";
import ChatIconComponent from "./ChatIconComponent";

const ChatsHomePage = ({ userId }: ChatHomePageProps) => {
  const [recentMessages, setRecentMessages] = useState<
    IndividualAccordionDetailsProps[]
  >([]);
  const [isRecentMessagesLoading, setIsRecentMessagesLoading] = useState(false);
  const [getGlobalChatHistory] = useLazyGetGlobalChatHistoryQuery();
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const contentLoaderRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const mergeRecentMessagesUniqueContent = (
    prevList: IndividualAccordionDetailsProps[],
    newList: IndividualAccordionDetailsProps[],
  ) => {
    const combinedData = [...prevList, ...newList];
    const uniqueMap = new Map(
      combinedData.map((item) => [
        item?.created_at,
        item,
      ]),
    );

    const uniqueList = Array.from(uniqueMap.values());

    // Sort based on timestamp: updated_at > created_at
    uniqueList.sort((a, b) => {
      const aTime = new Date(a.updated_at || a.created_at).getTime();
      const bTime = new Date(b.updated_at || b.created_at).getTime();
      return bTime - aTime; // Descending order (newest first)
    });

    return uniqueList;
  };

  const fetchRecentMessages = (isInitialLoad: boolean, pageNo: number) => {
    if (isRecentMessagesLoading) return;
    if (isInitialLoad) setIsRecentMessagesLoading(true);
    const currentPage = pageNo;
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(currentPage));
    getGlobalChatHistory({
      endpoint: `${API_CONSTANTS.GET_GLOBAL_CHAT_HISTORY}?${queryParams.toString()}`,
    })
      .unwrap()
      .then((res) => {
        const { results, next } = res as RecentMessagesResponseProps;
        const newRecentMessages = results?.data || [];
        setRecentMessages((prev) =>
          mergeRecentMessagesUniqueContent(prev, newRecentMessages),
        );
        if (!next) setHasMoreData(false);
        if (results?.data?.length > 0 && next) {
          setPage(currentPage + 1);
        }
      })
      .catch((error) => {
        dispatch(
          showToastMessage({ message: error?.data?.error, severity: "error" }),
        );
        setRecentMessages([]); // Reset list on failure
      })
      .finally(() => {
        setIsRecentMessagesLoading(false);
      });
  };

  useEffect(() => {
    fetchRecentMessages(true, 1);
    const intervalId = setInterval(() => {
      fetchRecentMessages(false, 1);
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isRecentMessagesLoading && hasMoreData) {
          fetchRecentMessages(true, page);
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
  }, [isRecentMessagesLoading, hasMoreData, page]);

  const itemsToRender = isRecentMessagesLoading
    ? [...recentMessages, ...Array(8).fill(null)]
    : recentMessages;

  const getSenderName = (message: IndividualAccordionDetailsProps) => {
    if (message?.type === "group" || message?.type === "channel")
      return `${message?.sender?.first_name}: `;
    if (message?.type === "private" && message?.sender?.user_id === userId)
      return "You: ";
  };

  return (
    <div className="flex flex-1 flex-col pt-5 w-full">
      <p className="text-lg font-medium leading-7 text-neutral-600">Home</p>
      <div className="relative flex flex-1 flex-col overflow-auto">
        <div className="h-full">
          {itemsToRender?.length === 0 && !isRecentMessagesLoading ? (
            <ChatDefaultScreen
              text=" Welcome to the Teacher's Table!"
              description=" A space for educators to connect, share ideas, and inspire one
                   another. Let's learn and grow together!"
            />
          ) : (
            <div className="no-scrollbar flex h-full flex-col overflow-auto">
              {itemsToRender?.map(
                (recentMessage: IndividualAccordionDetailsProps) => {
                  const { name, id } = getNameAndIdBasedOnType(
                    recentMessage?.type,
                    recentMessage,
                    userId,
                  );
                  const obj =
                    userId === recentMessage?.sender?.user_id
                      ? recentMessage?.recipient
                      : recentMessage?.sender;
                  const isMessageUnread = recentMessage?.unread_count > 0;
                  return recentMessage ? (
                    <div
                      className="flex items-center gap-3 border-b border-b-gray-11 py-4 px-2 hover:bg-gray-200/40 hover:shadow-notification"
                      key={recentMessage?.updated_at}
                    >
                      <Link
                        href={`${URL_CONSTANTS.CHATS}?title=${name}&messageType=${recentMessage?.type}&id=${id}`}
                        className="flex w-full items-center gap-3"
                      >
                        <ChatIconComponent
                          type={recentMessage?.type}
                          name={name}
                          src={obj?.profile_image}
                          width={54}
                        />
                        <div className="flex w-full flex-col gap-1.5">
                          <div className="flex justify-between">
                            <p
                              className={clsx(
                                "text-lg font-light leading-snug text-black",
                                isMessageUnread && "!font-medium",
                              )}
                            >
                              {name}
                            </p>
                              {(recentMessage?.updated_at ||
                                recentMessage?.created_at) && (
                                <span className="text-lg font-normal leading-snug text-neutral-900">
                                  {formatTimestamp(
                                    recentMessage?.updated_at ||
                                      recentMessage?.created_at,
                                  )}
                                </span>
                              )}
                          </div>
                          {recentMessage?.message && (
                            <p
                              className={clsx(
                                "h-[1lh] w-full overflow-hidden text-ellipsis text-lg font-light leading-snug text-neutral-900 break-all",
                                isMessageUnread && "!font-medium",
                              )}
                            >
                              {recentMessage?.message && (
                                <span>{getSenderName(recentMessage)}</span>
                              )}
                              {recentMessage?.message}
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <SearchGlobalChatDetailSkeleton noOfItems={1} />
                  );
                },
              )}
              <div ref={contentLoaderRef} className="h-1 w-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsHomePage;
