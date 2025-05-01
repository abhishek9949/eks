  import { ReceivedProps } from "@/types/reducer";
  import { getDynamicHostAndPort, buildQueryParams }  from "@/hooks/useUrlMiddleware";

  const urlMiddleware = (received: ReceivedProps): string => {
    if (!received?.endpoint) {
      throw new Error("Endpoint is required in the received object");
    }

    const baseUrl = getDynamicHostAndPort(received.endpoint);

    if (received.filter) {
      const queryParams = buildQueryParams(received.filter);
      return `${baseUrl}?${queryParams}`;
    }

    return baseUrl;
  };

  export default urlMiddleware;
