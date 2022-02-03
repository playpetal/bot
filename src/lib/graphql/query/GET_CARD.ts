import { gql } from "@apollo/client/core";
import { Card, Maybe } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetCard($id: Int!) {
    getCard(id: $id) {
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
          title {
            title
          }
        }
      }
      issue
      quality
      tint
      createdAt
    }
  }
`;

export async function getCard(id: number) {
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    getCard: Maybe<Card>;
  }>;

  return data.getCard;
}
