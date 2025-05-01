import React from "react";
import SearchGlobalChatDetailSkeleton from "./SearchGlobalChatDetailSkeleton";
import { MessageSearchResultsProps } from "@/types/chats";
import {
  getMessageIdBasedOnType,
  getNameAndIdBasedOnType,
} from "@/utils/chatsReusableFunctions";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import Link from "next/link";
import { getDateAndTimeFromTimestamp } from "@/utils/reusableFunctions";
import ChatIconComponent from "./ChatIconComponent";

const MessageSearchResultsComponent = ({
  searchResults,
  userId,
  searchResultsCount,
  contentLoaderRef,
  isSearchMessageLoading,
  messageType,
  recipientId,
}: MessageSearchResultsProps) => {
  return (
    <div className="flex flex-1 flex-col pt-5 w-full">
      <div className="relative flex flex-1 flex-col overflow-auto">
        <div className="h-full">
          {searchResults.length === 0 && !isSearchMessageLoading ? (
            <p>No data found</p>
          ) : (
            <div className="flex h-full flex-col gap-3">
              {searchResultsCount > 0 && (
                <p>Found {searchResultsCount} results</p>
              )}
              <div className="no-scrollbar h-full overflow-auto">
                {searchResults?.map((searchMessage) => {
                  const { name } = getNameAndIdBasedOnType(
                    searchMessage?.type,
                    searchMessage,
                    userId,
                  );
                  const obj =
                    userId === searchMessage?.sender?.user_id
                      ? searchMessage?.recipient
                      : searchMessage?.sender;
                  const messageId = getMessageIdBasedOnType(
                    searchMessage?.type,
                    searchMessage,
                  );
                  return searchMessage ? (
                    <div
                      className="flex items-center gap-3 border-b border-b-gray-11 py-4 px-2 hover:bg-gray-200/40 hover:shadow-notification"
                      key={searchMessage?.updated_at}
                    >
                      <Link
                        href={`${URL_CONSTANTS.CHATS}?title=${name}&messageType=${messageType}&id=${recipientId}&searchedMessageId=${messageId}`}
                        className="flex w-full items-center gap-3"
                      >
                        <ChatIconComponent
                          type={searchMessage?.type}
                          name={name}
                          src={obj?.profile_image}
                          width={54}
                        />
                        <div className="flex w-full flex-col">
                          <div className="flex justify-between">
                            <p>{name}</p>
                            {searchMessage?.updated_at && (
                              <span className="text-base">
                                {getDateAndTimeFromTimestamp(
                                  searchMessage?.updated_at,
                                )}
                              </span>
                            )}
                          </div>
                          <p className="text-base max-h-[2lh] overflow-hidden text-ellipsis">
                            <span>
                              {userId === searchMessage?.sender?.user_id
                                ? "You: "
                                : searchMessage?.sender?.first_name +
                                  " " +
                                  searchMessage?.sender?.last_name +
                                  ": "}
                            </span>
                            {searchMessage?.message}
                          </p>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <SearchGlobalChatDetailSkeleton noOfItems={1} />
                  );
                })}
                <div ref={contentLoaderRef} className="h-1 w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageSearchResultsComponent;
