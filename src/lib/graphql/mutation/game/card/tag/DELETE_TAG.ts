import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation DeleteTag($tag: String!) {
    deleteTag(tag: $tag) {
      id
      tag
      emoji
      accountId
      updatedAt
      cardCount
    }
  }
`;

export async function deleteTag(discordId: string, tag: string): Promise<Tag> {
  const data = await mutate<{ deleteTag: Tag }>({
    operation,
    variables: { tag },
    authorization: tokenize(discordId),
  });

  return data.deleteTag;
}
