import { gql } from "@apollo/client/core";
import { Release } from "petal";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";
import { Prefab } from "../../mod/createCard";

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
        name
      }
      subgroup {
        name
      }
      group {
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
  { characterId, subgroupId, groupId, maxCards, rarity, releaseId }: Prefab
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
      character: { name: string };
      subgroup: { name: string } | null;
      group: { name: string } | null;
      maxCards: number;
      rarity: number;
      release: Release;
    };
  }>;

  return mutation.data.createPrefab;
}
