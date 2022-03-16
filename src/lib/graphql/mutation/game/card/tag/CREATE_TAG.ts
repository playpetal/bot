import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation CreateTag($name: String!, $emoji: String!) {
    createTag(name: $name, emoji: $emoji) {
      id
      tag
      emoji
      accountId
      updatedAt
    }
  }
`;

export async function createTag(
  discordId: string,
  name: string,
  emoji: string
): Promise<Tag> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { name, emoji },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createTag: Tag;
  }>;

  return data.createTag;
}
