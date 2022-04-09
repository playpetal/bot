import { gql } from "@apollo/client/core";
import { Character } from "petal";
import { query } from "../../../request";

const operation = gql`
  query SearchSubgroups($search: String!, $birthday: DateTime, $page: Int) {
    searchCharacters(search: $search, birthday: $birthday, page: $page) {
      id
      name
      birthday
      gender
    }
  }
`;

export async function searchCharacters({
  search,
  birthday,
  page,
}: {
  search: string;
  birthday?: Date;
  page?: number;
}): Promise<Character[]> {
  const data = await query<{
    searchCharacters: Character[];
  }>({
    query: operation,
    variables: { search, birthday, page },
  });

  return data.searchCharacters;
}
