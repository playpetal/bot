import { gql } from "@apollo/client/core";
import { Song } from "petal";
import { graphql, GraphQLResponse, Maybe } from "..";
import { tokenize } from "../../crypto";

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
      remainingGames
      isNewHour
    }
  }
`;
export async function getRandomSong(
  discordId: string,
  gender?: "MALE" | "FEMALE" | "COED"
) {
  const query = (await graphql.query({
    query: GET_RANDOM_SONG,
    variables: { gender },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{ getRandomSong: Maybe<Song> }>;

  return query.data.getRandomSong;
}
