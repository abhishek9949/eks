import { getRedirectionPath } from "@/utils/permissionFormate";


export const fetchAndRedirectIfNeeded = async (
  setIsLoading?: (loading: boolean) => void,
) : Promise<{ url: string, name: string } | null> => {
  if (setIsLoading) setIsLoading(true);

  try {
    const response = await fetch("/api/cookies/getCookies");
    const data = await response.json();
    
    const permissionCookie = data?.permissionCookie ? JSON.parse(data?.permissionCookie?.permissions_json) : [];

    if (permissionCookie?.length > 0) {
      const redirect = getRedirectionPath(
        permissionCookie[0]?.permission_name ?? "",
      );

      if (redirect) {
        if (setIsLoading) setIsLoading(false);
        return redirect;
      }
    }
  } catch (error) {
    console.error("Error fetching cookies:", error);
  }

  if (setIsLoading) setIsLoading(false);
  return null;
};
