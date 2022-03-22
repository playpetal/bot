import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation DeleteTag($tag: String!) {
    deleteTag(tag: $tag) {
      id
      tag
      emoji
      accountId
      updatedAt
    }
  }
`;

export async function deleteTag(discordId: string, tag: string): Promise<Tag> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { tag },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    deleteTag: Tag;
  }>;

  return data.deleteTag;
}
