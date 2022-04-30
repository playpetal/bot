import { gql } from "@apollo/client/core";
import { Maybe, Prefab } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetPrefab($id: Int!) {
    prefab(id: $id) {
      id
      character {
        id
        name
      }
      group {
        id
        name
      }
      subgroup {
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

export async function getPrefab(id: number): Promise<Maybe<Prefab>> {
  const data = await query<{ prefab: Maybe<Prefab> }>({
    query: operation,
    variables: { id },
  });

  return data.prefab;
}
