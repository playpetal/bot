import { gql } from "@apollo/client/core";
import { Maybe, Prefab } from "petal";
import { graphql, GraphQLResponse } from "../../..";

const query = gql`
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
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    prefab: Maybe<Prefab>;
  }>;

  return data.prefab;
}
