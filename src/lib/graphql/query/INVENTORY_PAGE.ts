import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query InventoryPage(
    $userId: Int!
    $group: String
    $subgroup: String
    $character: String
    $tag: String
  ) {
    inventoryPage(
      user: $userId
      group: $group
      subgroup: $subgroup
      character: $character
      tag: $tag
    ) {
      max
      cards
    }
  }
`;

export async function inventoryPage(
  userId: number,
  {
    character,
    subgroup,
    group,
    tag,
  }: {
    character?: string;
    group?: string;
    subgroup?: string;
    tag?: string;
  }
) {
  const { data } = (await graphql.query({
    query,
    variables: { userId, character, subgroup, group, tag },
  })) as GraphQLResponse<{
    inventoryPage: { max: number; cards: number };
  }>;

  return data.inventoryPage;
}
