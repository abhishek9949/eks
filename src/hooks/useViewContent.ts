import { API_CONSTANTS } from "@/constants/api";
import { useViewContentMutation } from "@/redux/allReducer";
import { useCallback } from "react";

export const useViewContent = () => {
  const [viewContent] = useViewContentMutation();

  // Return a function to be called when needed
  return useCallback(
    (contentId: string) => {
      viewContent({
        endpoint: `${API_CONSTANTS.API_CONTENT}${contentId}/view/`,
        method: "POST",
      }).unwrap();
    },
    [viewContent]
  );
};
