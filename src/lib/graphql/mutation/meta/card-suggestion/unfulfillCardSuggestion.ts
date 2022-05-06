import { gql } from "@apollo/client/core";
import { CardSuggestion } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation UnfulfillCardSuggestion($suggestionId: Int!) {
    unfulfillCardSuggestion(suggestionId: $suggestionId) {
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

export async function unfulfillCardSuggestion(
  discordId: string,
  suggestionId: number
): Promise<CardSuggestion> {
  const data = await mutate<{
    unfulfillCardSuggestion: CardSuggestion;
  }>({
    operation,
    variables: { suggestionId },
    authorization: tokenize(discordId),
  });

  return data.unfulfillCardSuggestion;
}
