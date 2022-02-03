import { gql } from "@apollo/client/core";
import { Card, PartialUser } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query SearchCards($search: String!, $ownerId: Int!) {
    searchCards(search: $search, ownerId: $ownerId) {
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

export async function searchCards(search: string, owner: PartialUser) {
  const { data } = (await graphql.query({
    query,
    variables: { ownerId: owner.id, search },
  })) as GraphQLResponse<{
    searchCards: Card[];
  }>;

  return data.searchCards;
}
