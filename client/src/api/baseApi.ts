import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

// Типізуємо структуру GraphQL запиту
export interface GraphQLRequestArg {
  document: string;
  variables?: Record<string, unknown> | void;
}

// Типізуємо очікувану відповідь від сервера
interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:4000/graphql",
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

    // Перевіряємо наявність даних та типізуємо їх через record
    if (
      result.data &&
      typeof result.data === "object" &&
      "data" in result.data
    ) {
      const graphqlResult = result.data as GraphQLResponse<unknown>;
      return { data: graphqlResult.data };
    }

    return result;
  }

  return rawBaseQuery(arg as FetchArgs | string, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Form"],
  endpoints: () => ({}),
});

export const api = baseApi;
