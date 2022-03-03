import { gql } from "@apollo/client/core";
import { Maybe, Release } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const query = gql`
  query GetRelease($id: Int!) {
    release(id: $id) {
      id
      droppable
    }
  }
`;

export async function getRelease(
  id: number,
  discordId: string
): Promise<Maybe<Release>> {
  const { data } = (await graphql.query({
    query,
    context: { headers: { Authorization: tokenize(discordId) } },
    variables: { id },
  })) as GraphQLResponse<{
    release: Maybe<Release>;
  }>;

  return data.release;
}
