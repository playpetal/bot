import { gql } from "@apollo/client/core";
import { CardSuggestion, Maybe } from "petal";
import { mutate } from "../../../request";

const operation = gql`
  query GetCardSuggestion($id: Int, $groupName: String, $subgroupName: String) {
    getCardSuggestion(
      id: $id
      groupName: $groupName
      subgroupName: $subgroupName
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

export async function getCardSuggestion({
  id,
  groupName,
  subgroupName,
}: {
  id?: number;
  groupName?: string;
  subgroupName?: string;
}): Promise<Maybe<CardSuggestion>> {
  const data = await mutate<{
    getCardSuggestion: Maybe<CardSuggestion>;
  }>({
    operation,
    variables: { id, groupName, subgroupName },
  });

  return data.getCardSuggestion;
}
