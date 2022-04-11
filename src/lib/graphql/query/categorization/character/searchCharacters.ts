import { gql } from "@apollo/client/core";
import { Character, Gender } from "petal";
import { query } from "../../../request";

const operation = gql`
  query SearchSubgroups(
    $search: String!
    $birthday: DateTime
    $birthdayBefore: DateTime
    $birthdayAfter: DateTime
    $page: Int
    $gender: Gender
  ) {
    searchCharacters(
      search: $search
      birthday: $birthday
      birthdayBefore: $birthdayBefore
      birthdayAfter: $birthdayAfter
      gender: $gender
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
  gender,
}: {
  search: string;
  birthday?: Date;
  birthdayBefore?: Date;
  birthdayAfter?: Date;
  page?: number;
  gender?: Gender | null;
}): Promise<Character[]> {
  const data = await query<{
    searchCharacters: Character[];
  }>({
    query: operation,
    variables: {
      search,
      birthday,
      birthdayBefore,
      birthdayAfter,
      page,
      gender,
    },
  });

  return data.searchCharacters;
}
