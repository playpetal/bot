import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation EditTag($tag: String!, $name: String, $emoji: String) {
    editTag(tag: $tag, name: $name, emoji: $emoji) {
      id
      tag
      emoji
      accountId
      updatedAt
      cardCount
    }
  }
`;

export async function editTag(
  discordId: string,
  tag: string,
  tagData: { name?: string; emoji?: string }
): Promise<Tag> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { tag, ...tagData },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    editTag: Tag;
  }>;

  return data.editTag;
}
