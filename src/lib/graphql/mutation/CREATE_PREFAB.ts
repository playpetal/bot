import { gql } from "@apollo/client/core";
import { Prefab } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
  mutation CreatePrefab(
    $characterId: Int!
    $releaseId: Int
    $subgroupId: Int
    $groupId: Int
    $maxCards: Int
    $rarity: Int
  ) {
    createPrefab(
      characterId: $characterId
      releaseId: $releaseId
      subgroupId: $subgroupId
      groupId: $groupId
      maxCards: $maxCards
      rarity: $rarity
    ) {
      id
      character {
        id
        name
      }
      subgroup {
        id
        name
      }
      group {
        id
        name
      }
      maxCards
      rarity
      release {
        id
        droppable
      }
    }
  }
`;

export async function createPrefab(
  discordId: string,
  {
    characterId,
    subgroupId,
    groupId,
    maxCards,
    rarity,
    releaseId,
  }: {
    characterId: number;
    subgroupId?: number;
    groupId?: number;
    maxCards?: number;
    rarity?: number;
    releaseId?: number;
  }
) {
  const data = await mutate<{ createPrefab: Prefab }>({
    operation,
    variables: {
      characterId,
      subgroupId,
      groupId,
      maxCards,
      rarity,
      releaseId,
    },
    authorization: tokenize(discordId),
  });

  return data.createPrefab;
}
