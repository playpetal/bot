import { gql } from "@apollo/client/core";
import { Prefab, Release } from "petal";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const CREATE_PREFAB = gql`
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
  const mutation = (await graphql.mutate({
    mutation: CREATE_PREFAB,
    variables: {
      characterId,
      subgroupId,
      groupId,
      maxCards,
      rarity,
      releaseId,
    },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createPrefab: {
      id: number;
      character: { id: number; name: string };
      subgroup: { id: number; name: string } | null;
      group: { id: number; name: string } | null;
      maxCards: number;
      rarity: number;
      release: Release;
    };
  }>;

  return mutation.data.createPrefab;
}
