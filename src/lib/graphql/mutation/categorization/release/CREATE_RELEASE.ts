import { gql } from "@apollo/client/core";
import { PartialUser, Release } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../../crypto";

const query = gql`
  mutation CreateRelease {
    createRelease {
      id
      droppable
    }
  }
`;

export async function createRelease(user: PartialUser): Promise<Release> {
  const { data } = (await graphql.query({
    query: query,
    context: { headers: { Authorization: tokenize(user.discordId) } },
  })) as GraphQLResponse<{
    createRelease: Release;
  }>;

  return data.createRelease;
}
