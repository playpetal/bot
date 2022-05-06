import { gql } from "@apollo/client/core";
import { CardSuggestion } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation CreateCardSuggestion(
    $groupName: String!
    $subgroupName: String!
    $publicMessageId: String!
    $privateMessageId: String!
  ) {
    createCardSuggestion(
      groupName: $groupName
      subgroupName: $subgroupName
      publicMessageId: $publicMessageId
      privateMessageId: $privateMessageId
    ) {
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

export async function createCardSuggestion(
  discordId: string,
  groupName: string,
  subgroupName: string,
  publicMessageId: string,
  privateMessageId: string
): Promise<CardSuggestion> {
  const data = await mutate<{
    createCardSuggestion: CardSuggestion;
  }>({
    operation,
    variables: { groupName, subgroupName, publicMessageId, privateMessageId },
    authorization: tokenize(discordId),
  });

  return data.createCardSuggestion;
}
