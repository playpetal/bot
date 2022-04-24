import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import fetch from "cross-fetch";

export const graphql = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.YUME_URL!,
  link: new HttpLink({ uri: process.env.YUME_URL!, fetch }),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});

export type GraphQLResponse<Result> = { data: Result };
