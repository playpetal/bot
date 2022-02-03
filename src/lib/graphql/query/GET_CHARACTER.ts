import { gql } from "@apollo/client/core";
import { Character, Maybe } from "petal";
import { graphql, GraphQLResponse } from "..";

const query = gql`
  query GetCharacter($id: Int!) {
    getCharacter(id: $id) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function getCharacter(id: number) {
  const { data } = (await graphql.query({
    query: query,
    variables: { id },
  })) as GraphQLResponse<{
    getCharacter: Maybe<Character>;
  }>;

  return data.getCharacter;
}
