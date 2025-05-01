import { IndividualMessageProps } from "@/types/chats";
import { getMessageIdBasedOnType } from "./chatsReusableFunctions";

export const normalizeMessage = (message: any, source: "ably" | "api"): IndividualMessageProps => {
  if (source === "api") {
    return {
      id: getMessageIdBasedOnType(message?.type, message),
      text: message?.message,
      sender: {
        id: message?.sender?.user_id,
        name: message?.sender?.first_name + " " + message?.sender?.last_name,
        profile_image: message?.sender?.profile_image
      },
      timestamp: new Date(message.updated_at).getTime(),
      uniqueId: message?.unique_id,
      parent_id: message?.parent_id,
      parent_message: message?.parent_message,
      type: message?.type
    };
  } else if (source === "ably") {
    return {
      id: message?.id,
      text: message?.data?.message_text,
      sender: {
        id: message?.data?.sender_id,
        name: message?.data?.sender_name,
        profile_image: message?.data?.profile_image
      },
      timestamp: message?.timestamp,
      uniqueId: message?.data?.unique_id,
      parent_id: message?.data?.parent_id,
      parent_message: message?.data?.parent_text,
      type: message?.data?.type
    };
  }
  throw new Error("Unknown message source");
};
