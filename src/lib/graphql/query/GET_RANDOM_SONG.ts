import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const GET_RANDOM_SONG = gql`
  query ($gender: GroupGender) {
    getRandomSong(gender: $gender) {
      id
      title
      group
      video
      maxReward
      timeLimit
      maxGuesses
    }
  }
`;

type Song = {
  id: number;
  title: string;
  group: string;
  video: string;
  maxReward: number;
  timeLimit: number;
  maxGuesses: number;
};

export async function getRandomSong(gender?: "MALE" | "FEMALE" | "COED") {
  const query = (await graphql.query({
    query: GET_RANDOM_SONG,
    variables: { gender },
  })) as GraphQLResponse<{ getRandomSong: Maybe<Song> }>;

  return query.data.getRandomSong;
}
