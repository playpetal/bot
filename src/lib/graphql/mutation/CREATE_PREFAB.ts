import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";
import { Prefab } from "../../mod/createCard";

const CREATE_PREFAB = gql`
  mutation CreatePrefab(
    $characterId: Int!
    $subgroupId: Int
    $groupId: Int
    $maxCards: Int
    $rarity: Int
  ) {
    createPrefab(
      characterId: $characterId
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
    }
  }
`;

export async function createPrefab(
  discordId: string,
  { characterId, subgroupId, groupId, maxCards, rarity }: Prefab
) {
  const mutation = (await graphql.mutate({
    mutation: CREATE_PREFAB,
    variables: { characterId, subgroupId, groupId, maxCards, rarity },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createPrefab: {
      id: number;
      character: { name: string };
      subgroup: { name: string } | null;
      group: { name: string } | null;
      maxCards: number;
      rarity: number;
    };
  }>;

  return mutation.data.createPrefab;
}
