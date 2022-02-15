import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query Inventory(
    $user: Int!
    $next: Int
    $prev: Int
    $group: String
    $subgroup: String
    $character: String
  ) {
    inventory(
      user: $user
      next: $next
      prev: $prev
      group: $group
      subgroup: $subgroup
      character: $character
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
    }
  }
`;

export async function inventory(
  userId: number,
  {
    next,
    prev,
    character,
    subgroup,
    group,
  }: {
    next?: number;
    prev?: number;
    character?: string;
    group?: string;
    subgroup?: string;
  }
) {
  const { data } = (await graphql.query({
    query,
    variables: { user: userId, next, prev, character, subgroup, group },
  })) as GraphQLResponse<{
    inventory: Card[];
  }>;

  return data.inventory;
}
