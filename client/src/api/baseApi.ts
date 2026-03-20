import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

export interface GraphQLRequestArg {
  document: string;
  variables?: Record<string, unknown> | void;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/graphql",
  headers: {
    "Content-Type": "application/json",
  },
});

const customBaseQuery: BaseQueryFn<
  GraphQLRequestArg | FetchArgs | string,
  unknown,
  FetchBaseQueryError
> = async (arg, api, extraOptions) => {
  if (typeof arg !== "string" && "document" in arg) {
    const result = await rawBaseQuery(
      {
        url: "",
        method: "POST",
        body: {
          query: arg.document,
          variables: arg.variables || undefined,
        },
      },
      api,
      extraOptions,
    );

    if (result.error) {
      return result;
    }

    const graphqlResult = result.data as GraphQLResponse<unknown>;

    if (graphqlResult.errors?.length) {
      return {
        error: {
          status: 400,
          data: graphqlResult.errors,
        },
      };
    }

    if (graphqlResult.data !== undefined) {
      return { data: graphqlResult.data };
    }
  }

  return rawBaseQuery(arg as FetchArgs | string, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Form", "Response"],
  endpoints: () => ({}),
});

export const api = baseApi;
