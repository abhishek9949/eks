import { useMemo } from "react";
import { ReceivedProps } from "@/types/reducer";

const BASE_HOSTNAME = process.env.NEXT_PUBLIC_API_ROUTE ?? "";
const BASE_HOSTNAME_PPEFIX = process.env.NEXT_PUBLIC_API_ROUTE_PREFIX ?? "http://localhost";


export const getDynamicHostAndPort = (endpoint: string): string => {
  if (endpoint.includes("media")) return `${BASE_HOSTNAME_PPEFIX}ml${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("/api/content/block")) return  `${BASE_HOSTNAME_PPEFIX}user${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("subscription")) return `${BASE_HOSTNAME_PPEFIX}subscription${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("forum")) return `${BASE_HOSTNAME_PPEFIX}forum${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("/api/bin")) return `${BASE_HOSTNAME_PPEFIX}bin${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("/api/chat")) return `${BASE_HOSTNAME_PPEFIX}chat${BASE_HOSTNAME}${endpoint}`;
  if (endpoint.includes("/api/content")) return `${BASE_HOSTNAME_PPEFIX}contentmanagement${BASE_HOSTNAME}${endpoint}` ;
  if (endpoint.includes("v1")) return `${BASE_HOSTNAME_PPEFIX}contentupload${BASE_HOSTNAME}${endpoint}` ;
  if (endpoint.includes("/api/notification")) return `${BASE_HOSTNAME_PPEFIX}notification${BASE_HOSTNAME}${endpoint}` ;
  return  `${BASE_HOSTNAME_PPEFIX}user${BASE_HOSTNAME}${endpoint}`
};

export const buildQueryParams = (filter?: Record<string, any>): string => {
  return filter ? new URLSearchParams(filter).toString() : "";
};

const useUrlMiddleware = (received: ReceivedProps | null): string | null => {
  return useMemo(() => {
    if (!received?.endpoint) return null;

    const fullUrl = getDynamicHostAndPort(received.endpoint);
    const queryParams = buildQueryParams(received.filter);

    return queryParams ? `${fullUrl}?${queryParams}` : fullUrl;
  }, [received]);
};

export default useUrlMiddleware;
