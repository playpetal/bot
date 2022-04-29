import { gql } from "@apollo/client/core";
import { GroupGender, GuessTheSong } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation StartGuessTheSong(
    $gender: GroupGender
    $group: Int
    $messageId: String
    $channelId: String
    $guildId: String
  ) {
    startGuessTheSong(
      gender: $gender
      group: $group
      messageId: $messageId
      channelId: $channelId
      guildId: $guildId
    ) {
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
    }
  }
`;

export async function startGuessTheSong(
  discordId: string,
  message: { messageId: string; channelId: string; guildId: string },
  options?: { gender?: GroupGender; group?: number }
): Promise<GuessTheSong> {
  const data = await mutate<{ startGuessTheSong: GuessTheSong }>({
    operation,
    variables: { ...message, ...options },
    authorization: tokenize(discordId),
  });

  return data.startGuessTheSong;
}
