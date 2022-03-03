import { gql } from "@apollo/client/core";
import { Prefab } from "petal";
import { graphql, GraphQLResponse } from "../../..";
import { tokenize } from "../../../crypto";

const query = gql`
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
  const { data } = (await graphql.query({
    query: query,
    variables: {
      prefabId: id,
      characterId,
      subgroupId,
      groupId,
      rarity,
      maxCards,
      releaseId,
    },
    context: { headers: { Authorization: tokenize(senderId) } },
  })) as GraphQLResponse<{
    updatePrefab: Prefab;
  }>;

  return data.updatePrefab;
}
