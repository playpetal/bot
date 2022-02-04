import { gql } from "@apollo/client/core";
import { Card } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query Inventory($user: Int!, $next: Int, $prev: Int) {
    inventory(user: $user, next: $next, prev: $prev) {
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
    }
  }
`;

export async function inventory(
  userId: number,
  { next, prev }: { next?: number; prev?: number }
) {
  const { data } = (await graphql.query({
    query,
    variables: { user: userId, next, prev },
  })) as GraphQLResponse<{
    inventory: Card[];
  }>;

  return data.inventory;
}
