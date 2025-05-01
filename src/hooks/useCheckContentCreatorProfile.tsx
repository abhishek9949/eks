import { useEffect, useState } from "react";
import { useLazyCheckContentCreatorProfileQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";

export const useCheckContentCreatorProfile = () => {
  const [checkContentCreatorRes, setCheckContentCreatorRes] = useState<{is_creator_created: boolean}>();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [checkContentCreatorProfile] = useLazyCheckContentCreatorProfileQuery();

  const fetchCheckingContentCreator = async () => {
    setLoading(true);
    try {
      const response = await checkContentCreatorProfile({
        endpoint: `${API_CONSTANTS.CHECK_CONTENT_CREATOR_PROFILE}`,
      }).unwrap();
      if (response) {
        setCheckContentCreatorRes(response);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckingContentCreator();
  }, [checkContentCreatorProfile, dispatch]);

  return { checkContentCreatorRes, loading, fetchCheckingContentCreator };
};
