"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Close, CloseOutlined, Search, SendSharp } from "@mui/icons-material";
import GroupChatHeader from "./GroupChatHeader";
import DisplayMessages from "./DisplayMessages";
import { MessageComponentProps } from "@/types/chats";
import ChatDefaultScreen from "./ChatDefaultScreen";
import CustomAvatar from "@/components/common/CustomAvatar";
import useDebounce from "@/hooks/useDebounce";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import ChatIconComponent from "./ChatIconComponent";

const MessageComponent = ({
  text,
  setText,
  handleSendMessage,
  ablyChannelId,
  groupDetails,
  handleDeleteGroup,
  handleLeaveGroup,
  userId,
  messages,
  setMessages,
  scrollContainerRef,
  handleScroll,
  isReplyMessage,
  setIsReplyMessage,
  selectedMessage,
  setSelectedMessage,
  handleDeleteMessage,
  profileImage,
}: MessageComponentProps) => {
  const searchParams = useSearchParams();
  const title = useMemo(() => searchParams?.get("title") ?? "", [searchParams]);
  const messageType = searchParams.get("messageType") ?? "";
  const [isSearchBoxOpen, setIsSearchBoxOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 500);
  const { updateSearchParams } = useUpdateSearchParams();

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const handleCloseReplyMessage = () => {
    setIsReplyMessage(false);
    setSelectedMessage(undefined);
    updateSearchParams({ messageSearch: "" });
  };

  useEffect(() => {
    updateSearchParams({ messageSearch: debouncedSearchText });
  }, [debouncedSearchText]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className="flex flex-1 flex-col py-2 w-full">
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 flex h-[4.375rem] w-full items-center justify-between shadow-newgroupbutton">
          {messageType === "group" ? (
            <GroupChatHeader
              groupDetails={groupDetails}
              handleDeleteGroup={handleDeleteGroup}
              handleLeaveGroup={handleLeaveGroup}
              userId={userId}
            />
          ) : (
            <div className="flex items-center gap-2">
              <ChatIconComponent
                type={messageType}
                name={title}
                width={35}
                src={profileImage}
              />
              <p className="text-lg font-medium leading-normal text-neutral-900 ">
                {title}
              </p>
            </div>
          )}
          {isSearchBoxOpen ? (
            <div className="flex items-center gap-2">
              <div className="flex h-8 items-center gap-2 rounded-lg border border-solid border-gray-27 p-2">
                <Search className="!text-slate-400" />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setSearchText(e?.target.value)}
                />
              </div>
              <div className="flex h-8 w-8 cursor-pointer rounded-lg border border-solid border-zinc-300">
                <Close
                  className="m-auto h-4 w-4"
                  onClick={() => setIsSearchBoxOpen(false)}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 cursor-pointer rounded-lg border border-solid border-zinc-300">
              <Search
                className="m-auto h-5 w-5"
                onClick={() => setIsSearchBoxOpen(true)}
              />
            </div>
          )}
        </div>
        <div
          ref={scrollContainerRef}
          className="no-scrollbar flex h-full w-full flex-grow items-end overflow-auto pt-5"
        >
          {messages?.length === 0 ? (
            <ChatDefaultScreen
              text="Start messaging now"
              description="A space for educators to connect, share ideas, and inspire one another. Let's learn and grow together!"
            />
          ) : (
            <DisplayMessages
              ablyChannelId={ablyChannelId}
              messages={messages}
              setMessages={setMessages}
              setIsReplyMessage={setIsReplyMessage}
              setSelectedMessage={setSelectedMessage}
              handleDeleteMessage={handleDeleteMessage}
              messageType={messageType}
            />
          )}
        </div>
        <div className="sticky flex w-full flex-col py-5">
          <div className="flex w-full flex-col rounded border border-solid border-zinc-100 shadow-messageField">
            {isReplyMessage && (
              <div className="m-2 flex justify-between rounded border-l border-r border-t border-neutral-200 bg-zinc-100 p-2">
                <div className="flex items-center gap-2">
                  <CustomAvatar
                    key={selectedMessage?.sender?.id}
                    name={selectedMessage?.sender?.name}
                    width={35}
                    height={35}
                    randomColor
                    src={selectedMessage?.sender?.profile_image}
                  />
                  {selectedMessage?.text}
                </div>
                <CloseOutlined
                  fontSize="small"
                  className="cursor-pointer"
                  onClick={handleCloseReplyMessage}
                />
              </div>
            )}
            <TextField
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              multiline
              className="!flex !max-h-[10lh] overflow-auto !w-full !flex-col"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="start">
                      <SendSharp
                        onClick={() => handleSendMessage()}
                        className="cursor-pointer"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
