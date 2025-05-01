import React from "react";
import IndividualMessageComponent from "./IndividualMessageComponent";
import { useAppSelector } from "@/redux/hooks";
import { normalizeMessage } from "@/utils/normalizeMessage";
import { DisplayMessagesProps } from "@/types/chats";
import { useChannel } from "ably/react";
import { Skeleton } from "@mui/material";

const DisplayMessages = ({
  ablyChannelId,
  messages,
  setMessages,
  setIsReplyMessage,
  setSelectedMessage,
  handleDeleteMessage,
  messageType
}: DisplayMessagesProps) => {
  
  const userId =
    useAppSelector((state) => state.cookies.cookies.userCookies?.user_id) ?? 0;

  useChannel(ablyChannelId, (message) => {
    setMessages((prev) => {
      const newMessage = normalizeMessage(message, "ably");
      // Check if a message with the same timestamp already exists
      const isDuplicate = prev.some(
        (msg) => msg.uniqueId === newMessage.uniqueId,
      );

      if (isDuplicate) return prev; // Prevent duplicate message

      return [...prev, newMessage];
    });
  });

  return (
    <div className="mt-auto flex w-full flex-col gap-6">
      {messages?.map((message, index) =>
        message ? (
          <IndividualMessageComponent
            message={message}
            userId={userId}
            key={message?.id}
            setIsReplyMessage={setIsReplyMessage}
            setSelectedMessage={setSelectedMessage}
            handleDeleteMessage={handleDeleteMessage}
            messageType={messageType}
          />
        ) : (
          <Skeleton
            key={index + 1}
            variant="text"
            height={70}
            className="w-full"
          />
        ),
      )}
    </div>
  );
};

export default DisplayMessages;
