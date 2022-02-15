import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query InventoryPage(
    $cursor: Int!
    $userId: Int!
    $group: String
    $subgroup: String
    $character: String
  ) {
    inventoryPage(
      cursor: $cursor
      user: $userId
      group: $group
      subgroup: $subgroup
      character: $character
    ) {
      current
      max
      cards
    }
  }
`;

export async function inventoryPage(
  userId: number,
  cursor: number,
  {
    character,
    subgroup,
    group,
  }: {
    character?: string;
    group?: string;
    subgroup?: string;
  }
) {
  const { data } = (await graphql.query({
    query,
    variables: { userId, cursor, character, subgroup, group },
  })) as GraphQLResponse<{
    inventoryPage: { current: number; max: number; cards: number };
  }>;

  return data.inventoryPage;
}
