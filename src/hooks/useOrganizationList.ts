import { useEffect, useState } from "react";
import { API_CONSTANTS } from "@/constants/api";
import { useLazyGetOrganisationListQuery } from "@/redux/allReducer";
import { OrganisationListProps, IndividualOrganisationProps } from "@/types/organisation";

export const useOrganizationList = () => {
  const [organizationList, setOrganizationList] = useState<IndividualOrganisationProps[]>([]);
  const [organizationCount, setOrganizationCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [getOrganisationList] = useLazyGetOrganisationListQuery<OrganisationListProps>();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const organizationResponse = await getOrganisationList({
          endpoint: `${API_CONSTANTS.GET_ORGANISATION_LIST}?pagination=false`,
        }).unwrap();

        if (organizationResponse?.results) {
          setOrganizationList(organizationResponse.results);
          setOrganizationCount(organizationResponse.count)
        }
      } catch (err) {
        setError("Failed to fetch organization list");
        console.error("Error fetching organization list:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [getOrganisationList]);

  return { organizationList, loading, error, organizationCount };
};