import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  reducerPath: "emptySplitApi",
  baseQuery: fetchBaseQuery({
    prepareHeaders: (headers) => {
      if (window.localStorage.getItem("access_token")) {
        headers.set(
          "Authorization",
          `Bearer ${window.localStorage.getItem("access_token")}`,
        );
      }
      headers.set("Access-Control-Allow-Origin", "*");
      return headers;
    },
  }),
  endpoints: () => ({}),
});

export default emptySplitApi;
