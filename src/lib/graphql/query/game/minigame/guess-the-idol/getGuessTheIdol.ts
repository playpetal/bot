import { gql } from "@apollo/client/core";
import { GuessTheIdol, Maybe, PartialUser } from "petal";
import { tokenize } from "../../../../crypto";
import { query } from "../../../../request";

const operation = gql`
  query GetGuessTheIdol {
    getGuessTheIdol {
      type
      accountId
      state
      character {
        name
        birthday
        gender
      }
      attempts {
        name
        birthday
        gender
        nameLength
        birthDate
        isGender
      }
      maxAttempts
      timeLimit
      startedAt
      elapsed
      messageId
      channelId
      guildId
    }
  }
`;

export async function getGuessTheIdol(
  account: PartialUser
): Promise<Maybe<GuessTheIdol>> {
  const data = await query<{ getGuessTheIdol: Maybe<GuessTheIdol> }>({
    query: operation,
    authorization: tokenize(account.discordId),
  });

  return data.getGuessTheIdol;
}
