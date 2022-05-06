import { gql } from "@apollo/client/core";
import { CardSuggestion } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation DeleteCardSuggestion($id: Int!) {
    deleteCardSuggestion(id: $id) {
      id
      groupName
      subgroupName
      suggestedBy {
        id
        discordId
        username
        title {
          title
        }
        flags
      }
      fulfilledBy {
        id
        discordId
        username
        title {
          title
        }
        flags
      }
      fulfilled
      votes {
        id
        account {
          id
          discordId
          username
          title {
            title
          }
          flags
        }
      }
      publicMessageId
      privateMessageId
    }
  }
`;

export async function deleteCardSuggestion(
  discordId: string,
  id: number
): Promise<CardSuggestion> {
  const data = await mutate<{
    deleteCardSuggestion: CardSuggestion;
  }>({
    operation,
    variables: { id },
    authorization: tokenize(discordId),
  });

  return data.deleteCardSuggestion;
}
