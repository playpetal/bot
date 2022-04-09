import { gql } from "@apollo/client/core";
import { Character } from "petal";
import { query } from "../../../request";

const operation = gql`
  query SearchSubgroups(
    $search: String!
    $birthday: DateTime
    $birthdayBefore: DateTime
    $birthdayAfter: DateTime
    $page: Int
  ) {
    searchCharacters(
      search: $search
      birthday: $birthday
      birthdayBefore: $birthdayBefore
      birthdayAfter: $birthdayAfter
      page: $page
    ) {
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
  birthdayBefore,
  birthdayAfter,
  page,
}: {
  search: string;
  birthday?: Date;
  birthdayBefore?: Date;
  birthdayAfter?: Date;
  page?: number;
}): Promise<Character[]> {
  const data = await query<{
    searchCharacters: Character[];
  }>({
    query: operation,
    variables: { search, birthday, birthdayBefore, birthdayAfter, page },
  });

  return data.searchCharacters;
}
