import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const GET_CHARACTERS = gql`
  query GetCharacters($id: Int, $name: String, $birthday: DateTime) {
    characters(id: $id, name: $name, birthday: $birthday) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function getCharacters({
  id,
  name,
  birthday,
}: {
  id?: number;
  name?: string;
  birthday?: Date;
}) {
  const query = (await graphql.query({
    query: GET_CHARACTERS,
    variables: { id, name, birthday },
  })) as GraphQLResponse<{
    characters: {
      id: number;
      name: string;
      birthday: Date | null;
      gender: "MALE" | "FEMALE" | "NONBINARY" | null;
    }[];
  }>;

  return query.data.characters;
}
