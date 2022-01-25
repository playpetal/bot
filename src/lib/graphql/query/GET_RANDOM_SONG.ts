import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_RANDOM_SONG = gql`
  query ($gender: GroupGender) {
    getRandomSong(gender: $gender) {
      id
      title
      group {
        name
        aliases {
          alias
        }
      }
    }
  }
`;

type Song = {
  id: number;
  title: string;
  group: {
    name: string;
    aliases: {
      alias: string;
    };
  };
};

export async function getRandomSong(gender?: "MALE" | "FEMALE") {
  const query = (await graphql.query({
    query: GET_RANDOM_SONG,
    variables: { gender },
  })) as GraphQLResponse<{ getRandomSong: Maybe<Song> }>;

  return query.data.getRandomSong;
}
