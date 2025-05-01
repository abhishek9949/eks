import { useEffect, useState } from "react";
import { useLazyGetGlobalChatHistoryQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { InitialRecentMessagesValues, RecentMessagesResponseProps } from "@/types/chats";

export const useRecentMessages = () => {
  const [recentMessages, setRecentMessages] = useState<RecentMessagesResponseProps>(InitialRecentMessagesValues);
  const [isRecentMessagesLoading, setIsRecentMessagesLoading] = useState(true);
  const [getGlobalChatHistory] = useLazyGetGlobalChatHistoryQuery(); 

  useEffect(() => {
    const fetchRecentMessages = async () => {
     setIsRecentMessagesLoading(true);
      try {
        const recentMessagesResponse = await getGlobalChatHistory({
          endpoint: API_CONSTANTS.GET_GLOBAL_CHAT_HISTORY,
        }).unwrap() as RecentMessagesResponseProps;
        setRecentMessages(recentMessagesResponse || InitialRecentMessagesValues);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setRecentMessages(InitialRecentMessagesValues); // Reset list on failure
      } finally {
        setIsRecentMessagesLoading(false);
      }
    };

    fetchRecentMessages();
  }, [getGlobalChatHistory]);

  return { recentMessages, isRecentMessagesLoading };
};
