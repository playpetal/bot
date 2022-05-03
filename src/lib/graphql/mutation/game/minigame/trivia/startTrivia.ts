import { gql } from "@apollo/client/core";
import { GroupGender, Trivia } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation StartTrivia(
    $gender: GroupGender
    $group: String
    $messageId: String
    $channelId: String
    $guildId: String
  ) {
    startTrivia(
      gender: $gender
      group: $group
      messageId: $messageId
      channelId: $channelId
      guildId: $guildId
    ) {
      accountId
      state
      question
      answer
      options
      maxAttempts
      timeLimit
      startedAt
      elapsed
      group
      messageId
      channelId
      guildId
    }
  }
`;

export async function startTrivia(
  discordId: string,
  message: { messageId: string; channelId: string; guildId: string },
  options?: { gender?: GroupGender; group?: number }
): Promise<Trivia> {
  const data = await mutate<{ startTrivia: Trivia }>({
    operation,
    variables: { ...message, ...options },
    authorization: tokenize(discordId),
  });

  return data.startTrivia;
}
