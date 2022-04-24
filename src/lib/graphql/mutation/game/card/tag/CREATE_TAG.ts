import { gql } from "@apollo/client/core";
import { Tag } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
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
  const data = await mutate<{ createTag: Tag }>({
    operation,
    variables: { name, emoji },
    authorization: tokenize(discordId),
  });

  return data.createTag;
}
