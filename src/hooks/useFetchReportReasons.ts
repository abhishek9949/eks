import { useEffect, useState } from "react";
import { useLazyGetReportReasonsQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { useAppDispatch } from "@/redux/hooks";
import { ReportReasonSingle } from "@/types/reducer";

export const useReportReasonsList = (sortBy = "") => {
  const [reportReasonsList, setReportReasonsList] = useState<
    ReportReasonSingle[]
  >([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [getReportReasons] = useLazyGetReportReasonsQuery();

  const fetchReportReasons = async () => {
    setLoading(true);
    try {
      const reportReasonsRes = await getReportReasons({
        endpoint: `${API_CONSTANTS.GET_REPORT_COMMENT_REASONS}?sort_by=${sortBy}`,
      }).unwrap();
      if (reportReasonsRes) {
        setReportReasonsList(reportReasonsRes?.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportReasons();
  }, [getReportReasons, dispatch]);

  return { reportReasonsList, loading, fetchReportReasons };
};
