import { useEffect, useState } from "react";
import { useLazyGetGlobalUsersListQuery } from "@/redux/allReducer";
import { API_CONSTANTS } from "@/constants/api";

//USING ANY TYPE FOR THIS FILE BECAUSE IT WILL CHANGE,WILL USE SAME FILE CREATED FOR EDUCATORS AFTER MERGEING OF CODES
export const useGlobalUsersList = () => {
  const [globalUsersList, setGlobalUsersList] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [getGlobalUsersList] = useLazyGetGlobalUsersListQuery();

  useEffect(() => {
    const fetchGlobalUsersList = async () => {
      setLoading(true);
      try {
        const globalUsersListResponse: any = await getGlobalUsersList({
          endpoint: API_CONSTANTS.GET_GLOBAL_USERS_LIST_V2,
        }).unwrap();

        setGlobalUsersList(
          globalUsersListResponse?.data?.map((user: any) => ({
            ...user,
            name: `${user?.first_name} ${user?.last_name}`, // Added a space between first and last name
            id: user.user_id,
          })) || [],
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
