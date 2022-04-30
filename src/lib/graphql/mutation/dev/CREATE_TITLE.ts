import { gql } from "@apollo/client/core";
import { Title } from "petal";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation CreateTitle($title: String!, $description: String) {
    createTitle(title: $title, description: $description) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function createTitle(
  discordId: string,
  title: string,
  description?: string
): Promise<Title> {
  const data = await mutate<{ createTitle: Title }>({
    operation,
    variables: { title, description },
    authorization: tokenize(discordId),
  });

  return data.createTitle;
}
