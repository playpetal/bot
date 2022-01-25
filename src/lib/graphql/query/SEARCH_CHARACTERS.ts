import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";

const SEARCH_CHARACTERS = gql`
  query SearchSubgroups($search: String!) {
    searchCharacters(search: $search) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function searchCharacters(search: string) {
  const query = (await graphql.query({
    query: SEARCH_CHARACTERS,
    variables: { search },
  })) as GraphQLResponse<{
    searchCharacters: {
      id: number;
      name: string;
      birthday: Date | null;
      gender: "MALE" | "FEMALE" | "NONBINARY" | null;
    }[];
  }>;

  return query.data.searchCharacters;
}
