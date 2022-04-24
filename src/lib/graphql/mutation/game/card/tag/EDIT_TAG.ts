import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
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
  const data = await mutate<{ editTag: Tag }>({
    operation,
    variables: { tag, ...tagData },
    authorization: tokenize(discordId),
  });

  return data.editTag;
}
