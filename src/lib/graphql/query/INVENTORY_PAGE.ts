import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query InventoryPage($cursor: Int!, $userId: Int!) {
    inventoryPage(cursor: $cursor, user: $userId) {
      current
      max
      cards
    }
  }
`;

export async function inventoryPage(userId: number, cursor: number) {
  const { data } = (await graphql.query({
    query,
    variables: { userId, cursor },
  })) as GraphQLResponse<{
    inventoryPage: { current: number; max: number; cards: number };
  }>;

  return data.inventoryPage;
}
