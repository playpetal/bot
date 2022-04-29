import { gql } from "@apollo/client/core";
import { GuessTheSong, Maybe, PartialUser } from "petal";
import { tokenize } from "../../../../crypto";
import { query } from "../../../../request";

const operation = gql`
  query GetGuessTheSong {
    getGuessTheSong {
      type
      accountId
      state
      song {
        title
        group
        soloist
      }
      attempts {
        title
        group
        soloist
      }
      maxAttempts
      timeLimit
      startedAt
      elapsed
      video
      messageId
      channelId
      guildId
    }
  }
`;

export async function getGuessTheSong(
  account: PartialUser
): Promise<Maybe<GuessTheSong>> {
  const data = await query<{ getGuessTheSong: Maybe<GuessTheSong> }>({
    query: operation,
    authorization: tokenize(account.discordId),
  });

  return data.getGuessTheSong;
}
