import { gql } from "@apollo/client/core";
import { Gender, GuessTheIdol } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation StartGuessTheIdol(
    $gender: Gender
    $group: String
    $messageId: String
    $channelId: String
    $guildId: String
  ) {
    startGuessTheIdol(
      gender: $gender
      group: $group
      messageId: $messageId
      channelId: $channelId
      guildId: $guildId
    ) {
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
      group
    }
  }
`;

export async function startGuessTheIdol(
  discordId: string,
  message: { messageId: string; channelId: string; guildId: string },
  options?: { gender?: Gender; group?: string }
): Promise<GuessTheIdol> {
  const data = await mutate<{ startGuessTheIdol: GuessTheIdol }>({
    operation,
    variables: { ...message, ...options },
    authorization: tokenize(discordId),
  });

  return data.startGuessTheIdol;
}
