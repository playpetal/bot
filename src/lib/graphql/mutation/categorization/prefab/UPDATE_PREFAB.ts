import { gql } from "@apollo/client/core";
import { Prefab } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation UpdatePrefab(
    $prefabId: Int!
    $releaseId: Int
    $characterId: Int
    $subgroupId: Int
    $groupId: Int
    $rarity: Int
    $maxCards: Int
  ) {
    updatePrefab(
      prefabId: $prefabId
      characterId: $characterId
      subgroupId: $subgroupId
      groupId: $groupId
      rarity: $rarity
      maxCards: $maxCards
      releaseId: $releaseId
    ) {
      id
      character {
        name
      }
      subgroup {
        name
      }
      group {
        name
      }
      rarity
      maxCards
      release {
        id
        droppable
      }
    }
  }
`;

export async function updatePrefab({
  id,
  senderId,
  characterId,
  subgroupId,
  groupId,
  rarity,
  maxCards,
  releaseId,
}: {
  id: number;
  senderId: string;
  characterId?: number | null;
  subgroupId?: number | null;
  groupId?: number | null;
  rarity?: number;
  maxCards?: number;
  releaseId?: number;
}): Promise<Prefab> {
  const data = await mutate<{
    updatePrefab: Prefab;
  }>({
    operation,
    variables: {
      prefabId: id,
      characterId,
      subgroupId,
      groupId,
      rarity,
      maxCards,
      releaseId,
    },
    authorization: tokenize(senderId),
  });

  return data.updatePrefab;
}
