import { gql } from "@apollo/client/core";
import { PartialUser, Release } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const mutation = gql`
  mutation CreateRelease {
    createRelease {
      id
      droppable
    }
  }
`;

export async function createRelease(user: PartialUser): Promise<Release> {
  const { data } = (await graphql.mutate({
    mutation: mutation,
    context: { headers: { Authorization: tokenize(user.discordId) } },
  })) as GraphQLResponse<{
    createRelease: Release;
  }>;

  return data.createRelease;
}
