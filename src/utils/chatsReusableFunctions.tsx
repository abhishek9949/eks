import { IndividualAccordionDetailsProps } from "@/types/chats";
import { API_CONSTANTS } from "@/constants/api";

export const getNameAndIdBasedOnType = (
  type: string,
  detail: IndividualAccordionDetailsProps,
  userId: number,
) => {
  if (type === "group")
    return { name: detail?.group_name, id: detail?.group_id };
  if (type === "private") {
    const obj =
      userId === detail?.sender?.user_id ? detail?.recipient : detail?.sender;
    return {
      name: obj?.first_name + " " + obj?.last_name,
      id: obj?.user_id,
    };
  }
  if (type === "channel")
    return { name: detail?.channel_name, id: detail?.channel_id };

  return { name: "", id: 0 };
};

export const getMessageIdBasedOnType = (
  type: string,
  message: IndividualAccordionDetailsProps,
) => {
  if (type === "private") return message?.message_id;
  if (type === "group") return message?.group_message_id;
  return 0;
};

export const getApiEndpointBasedOnType = (type: string) => {
  if (type === "private") return API_CONSTANTS.UPDATE_PRIVATE_MESSAGE;
  if (type === "group") return API_CONSTANTS.UPDATE_GROUP_MESSAGE;
  if (type === "channel") return API_CONSTANTS.UPDATE_CHANNEL_MESSAGE;
  return "";
};
