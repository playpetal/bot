import { gql } from "@apollo/client/core";
import { Maybe, Tag } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const query = gql`
  query GetTag($tag: String!) {
    getTag(tag: $tag) {
      tag
      emoji
    }
  }
`;

export async function getTag(
  discordId: string,
  tag: string
): Promise<Maybe<Tag>> {
  const { data } = (await graphql.query({
    query,
    variables: { tag },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    getTag: Maybe<Tag>;
  }>;

  return data.getTag;
}
