import { gql } from "@apollo/client/core";
import { Maybe, Release } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
  query GetLastRelease {
    lastRelease {
      id
      droppable
    }
  }
`;

export async function getLastRelease(): Promise<Maybe<Release>> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    lastRelease: Maybe<Release>;
  }>;

  return data.lastRelease;
}
