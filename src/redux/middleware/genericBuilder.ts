/*
 A query operation can be performed with any data fetching library of your choice,
 but the general recommendation is that you only use queries for requests that
 retrieve data.  - Source: Official
*/

import { ReceivedProps } from '@/types/reducer';
import urlMiddleware from './urlMiddleware';
import { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
  
export function genericQueryBuilder<TResponse>(builder: EndpointBuilder<BaseQueryFn, string, "api">) {
  return (
    builder.query<TResponse, ReceivedProps>({
      query: (received: ReceivedProps) => {
        const finalUrl = urlMiddleware(received);

        return {
          url: `${finalUrl}`
        };
      }
    })
  );
}
  
/*
Mutations are used to send data updates to the server and apply the changes to the local cache.
Mutations can also invalidate cached data and force re-fetches.  - Source: Official
*/

export function genericQueryMutation<TResponse>(builder: EndpointBuilder<BaseQueryFn, string, "api">) {
  return (
    builder.mutation<TResponse, ReceivedProps>({
      query: (received: ReceivedProps) => {
        const finalUrl = urlMiddleware(received);

        return {
          url: finalUrl,
          method: received.method,
          body: received.data
        };
      }
    })
  );
}
