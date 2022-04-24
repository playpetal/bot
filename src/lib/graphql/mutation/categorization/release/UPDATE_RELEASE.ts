import { gql } from "@apollo/client/core";
import { PartialUser, Release } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const mutation = gql`
  mutation UpdateRelease($id: Int!, $droppable: Boolean) {
    updateRelease(id: $id, droppable: $droppable) {
      id
      droppable
    }
  }
`;

export async function updateRelease(
  user: PartialUser,
  id: number,
  droppable?: boolean
): Promise<Release> {
  const { data } = (await graphql.mutate({
    mutation: mutation,
    variables: {
      id,
      droppable,
    },
    context: { headers: { Authorization: tokenize(user.discordId) } },
  })) as GraphQLResponse<{
    updateRelease: Release;
  }>;

  return data.updateRelease;
}
