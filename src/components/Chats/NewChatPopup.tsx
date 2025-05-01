import React, { useEffect, useState } from "react";
import { CloseOutlined, Groups2Outlined, Search } from "@mui/icons-material";
import { Button, ClickAwayListener, Menu } from "@mui/material";
import {
  NewChatPopupProps,
  SearchedGlobalChatDetailsResponse,
} from "@/types/chats";
import useDebounce from "@/hooks/useDebounce";
import Link from "next/link";
import { URL_CONSTANTS } from "@/constants/routingUrl";
import SearchGlobalChatDetailSkeleton from "./SearchGlobalChatDetailSkeleton";
import { getNameAndIdBasedOnType } from "@/utils/chatsReusableFunctions";
import clsx from "clsx";
import { useRecentMessages } from "@/hooks/useRecentMessages";
import { useAppSelector } from "@/redux/hooks";
import ChatIconComponent from "./ChatIconComponent";

const NewChatPopup = ({
  handleOnClickCreateGroup,
  getSearchGlobalChatDetails,
  searchedGlobalChatDetailsResult,
  toggleNewChatPopup,
  isSearchGlobalChatDetailLoading,
  userId,
}: NewChatPopupProps) => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const { recentMessages, isRecentMessagesLoading } = useRecentMessages();
  const currentRole = useAppSelector((state) => state?.cookies?.cookies?.currentRoleCookie?.role_name);

  useEffect(() => {
    if (debouncedSearchText) {
      getSearchGlobalChatDetails(debouncedSearchText);
    }
  }, [debouncedSearchText, getSearchGlobalChatDetails]);

  const getUsernameByType = (detail: SearchedGlobalChatDetailsResponse) => {
    switch (detail?.chat_type) {
      case "channel":
        return { name: detail?.channel_name, id: detail?.channel_id };
      case "group":
        return { name: detail?.group_name, id: detail?.group_id };
      default:
        return {
          name: detail?.first_name + " " + detail?.last_name,
          id: detail?.id,
        };
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  return (
    <ClickAwayListener onClickAway={toggleNewChatPopup}>
      <div className="fixed z-99 ml-1 flex h-[27.25rem] max-h-[35vh] overflow-hidden w-[23.3125rem] max-w-[40vh] xsm:max-w-[50vh] flex-col bg-white shadow-newChatModal">
        <div className="m-4 grid h-11 shrink-0 grid-cols-12 gap-2 rounded border border-solid border-gray-27 p-2">
          <div
            className={clsx(
              "flex w-full gap-1",
              searchText ? "col-span-11" : "col-span-12",
            )}
          >
            <Search />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e?.target?.value)}
              placeholder="Search for people, groups or channels"
              className="w-full"
            />
          </div>
          {searchText && (
            <CloseOutlined
              fontSize="medium"
              className="cursor-pointer pr-2 text-black"
              onClick={handleClearSearch}
              data-testid="search-close-icon"
            />
          )}
        </div>
        {searchText ? (
          <div className="no-scrollbar mb-4 flex flex-col gap-3 overflow-scroll overflow-x-hidden px-4">
            {isSearchGlobalChatDetailLoading ? (
              <SearchGlobalChatDetailSkeleton />
            ) : (
              <>
                {searchedGlobalChatDetailsResult?.length === 0 ? (
                  <div className="flex items-center justify-center p-20">
                    <p className="text-lg text-black">No data found</p>
                  </div>
                ) : (
                  <>
                    {searchedGlobalChatDetailsResult?.map((detail) => {
                      const { name, id } = getUsernameByType(detail);
                      return (
                        <div
                          className="flex items-center gap-3"
                          key={detail?.id}
                        >
                          <ChatIconComponent
                            type={detail?.chat_type}
                            name={name}
                            src={detail?.profile_image}
                            width={35}
                            isChatPopup
                          />
                          <Link
                            href={`${URL_CONSTANTS.CHATS}?title=${name}&messageType=${detail?.chat_type}&id=${id}`}
                            onClick={toggleNewChatPopup}
                            className="flex flex-col"
                          >
                            <p>{name}</p>
                            <p>{detail?.email}</p>
                          </Link>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="no-scrollbar mb-4 flex flex-col gap-5 overflow-scroll overflow-x-hidden px-4">
            {currentRole !== "Educator" && (
              <Button
                className="flex !justify-start gap-2 p-0 hover:bg-white"
                onClick={handleOnClickCreateGroup}
              >
                <Groups2Outlined className="text-black" />
                <p className="text-base font-medium text-gray-31">
                  Create a group
                </p>
              </Button>
            )}
            <div className="flex flex-col gap-3">
              <p className="text-base font-medium text-gray-17">
                Recent Messages
              </p>
              <div className="flex flex-col gap-3">
                {isRecentMessagesLoading ? (
                  <SearchGlobalChatDetailSkeleton />
                ) : (
                  <>
                    {recentMessages?.results?.data?.length === 0 ? (
                      <div className="flex items-center justify-center p-20">
                        <p className="text-lg text-black">No recent messages</p>
                      </div>
                    ) : (
                      <>
                        {recentMessages?.results?.data?.map((message) => {
                          const { name, id } = getNameAndIdBasedOnType(
                            message?.type,
                            message,
                            userId,
                          );
                          const obj =
                            userId === message?.sender?.user_id
                              ? message?.recipient
                              : message?.sender;
                          return (
                            <div className="flex items-center gap-2" key={id}>
                              <ChatIconComponent
                                type={message?.type}
                                name={name}
                                src={obj?.profile_image}
                                width={35}
                                isChatPopup
                              />
                              <Link
                                href={`${URL_CONSTANTS.CHATS}?title=${name}&messageType=${message?.type}&id=${id}`}
                                onClick={toggleNewChatPopup}
                                className="flex flex-col"
                              >
                                <p>{name}</p>
                              </Link>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default NewChatPopup;
