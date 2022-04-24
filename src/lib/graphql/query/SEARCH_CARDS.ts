import { gql } from "@apollo/client/core";
import { Card, PartialUser, Quality } from "petal";
import { query } from "../request";

const operation = gql`
  query SearchCards(
    $search: String!
    $ownerId: Int!
    $prefabId: Int
    $minQuality: Quality
    $maxQuality: Quality
    $exclude: Int
  ) {
    searchCards(
      search: $search
      ownerId: $ownerId
      prefabId: $prefabId
      maxQuality: $maxQuality
      minQuality: $minQuality
      exclude: $exclude
    ) {
      id
      prefab {
        character {
          name
        }
        subgroup {
          name
        }
        group {
          name
        }
      }
    }
  }
`;

export async function searchCards(
  search: string,
  owner: PartialUser,
  options?: {
    prefabId?: number;
    maxQuality?: Quality;
    minQuality?: Quality;
    exclude?: number;
  }
) {
  const data = await query<{ searchCards: Card[] }>({
    query: operation,
    variables: { ownerId: owner.id, search, ...options },
  });

  return data.searchCards;
}
