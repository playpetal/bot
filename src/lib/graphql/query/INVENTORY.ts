import { gql } from "@apollo/client/core";
import { Card, InventoryOrder, InventorySort } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query Inventory(
    $userId: Int!
    $page: Int!
    $group: String
    $subgroup: String
    $character: String
    $sort: InventorySort
    $order: InventoryOrder
    $tag: String
  ) {
    inventory(
      userId: $userId
      page: $page
      group: $group
      subgroup: $subgroup
      character: $character
      sort: $sort
      order: $order
      tag: $tag
    ) {
      id
      prefab {
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
      }
      owner {
        id
        username
        title {
          title
        }
      }
      issue
      quality
      tint
      createdAt
      hasFrame
      tag {
        tag
        emoji
      }
    }
  }
`;

export async function inventory(
  userId: number,
  page: number,
  {
    character,
    subgroup,
    group,
    sort,
    order,
    tag,
  }: {
    character?: string;
    group?: string;
    subgroup?: string;
    sort?: InventorySort;
    order?: InventoryOrder;
    tag?: string;
  }
) {
  const { data } = (await graphql.query({
    query,
    variables: { userId, page, character, subgroup, group, sort, order, tag },
  })) as GraphQLResponse<{
    inventory: Card[];
  }>;

  return data.inventory;
}
