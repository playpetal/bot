import { gql } from "@apollo/client/core";
import { Maybe, Tag } from "petal";
import { tokenize } from "../../../../crypto";
import { query } from "../../../../request";

const operation = gql`
  query GetTag($tag: String!) {
    getTag(tag: $tag) {
      tag
      emoji
      cardCount
    }
  }
`;

export async function getTag(
  discordId: string,
  tag: string
): Promise<Maybe<Tag>> {
  const data = await query<{ getTag: Maybe<Tag> }>({
    query: operation,
    variables: { tag },
    authorization: tokenize(discordId),
  });

  return data.getTag;
}
