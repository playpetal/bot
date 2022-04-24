import { gql } from "@apollo/client/core";
import { GameSong, Maybe } from "petal";
import { tokenize } from "../crypto";
import { query } from "../request";

const operation = gql`
  query ($gender: GroupGender) {
    getRandomSong(gender: $gender) {
      id
      title
      group
      soloist
      video
    }
  }
`;
export async function getRandomSong(
  discordId: string,
  gender?: "MALE" | "FEMALE" | "COED"
): Promise<Maybe<GameSong>> {
  const data = await query<{ getRandomSong: Maybe<GameSong> }>({
    query: operation,
    variables: { gender },
    authorization: tokenize(discordId),
  });

  return data.getRandomSong;
}
