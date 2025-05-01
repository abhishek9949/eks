import { useEffect, useState } from "react";
import { useLazyGetGlobalUsersListQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";
import { GlobalUsersList } from "@/types/user";

export const useGlobalUsersList = () => {
  const [globalUsersList, setGlobalUsersList] = useState<GlobalUsersList[]>([]);
  const [loading, setLoading] = useState(true);
  const [getGlobalUsersList] = useLazyGetGlobalUsersListQuery();

  useEffect(() => {
    const fetchGlobalUsersList = async () => {
      setLoading(true);
      try {
        const globalUsersListResponse = await getGlobalUsersList({
          endpoint: API_CONSTANTS.GET_GLOBAL_USERS_LIST,
        }).unwrap();

        setGlobalUsersList(
          globalUsersListResponse?.data?.map((user) => ({
            ...user,
            name: `${user?.first_name} ${user?.last_name}`, // Added a space between first and last name
          })) || []
        );
      } catch (error) {
        setGlobalUsersList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalUsersList();
  }, [getGlobalUsersList]);

  return { globalUsersList, loading };
};
