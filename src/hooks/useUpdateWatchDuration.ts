import { useCallback } from "react";
import { API_CONSTANTS } from "@/constants/api";
import { useUpdateWatchDurationMutation } from "@/redux/allReducer";

export const useUpdateWatchDuration = () => {
  const [updateWatchDuration] = useUpdateWatchDurationMutation();

  return useCallback(
    async (contentId: string, watchDuration: number, contentType: string) => {
      if (watchDuration <= 0) return;

      const apiUrl = `${API_CONSTANTS.API_CONTENT}${contentId}/watch_duration/`;
      await updateWatchDuration({
        endpoint: apiUrl,
        method: "POST",
        data: {
          watch_duration: watchDuration,
          content_type: contentType,
        }
      }).unwrap();
    },
    [updateWatchDuration]
  );
};
