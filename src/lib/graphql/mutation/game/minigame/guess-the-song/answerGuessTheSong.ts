import { gql } from "@apollo/client/core";
import { GuessTheSong } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation AnswerGuessTheSong($answer: String!) {
    answerGuessTheSong(answer: $answer) {
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
      messageId
      channelId
      guildId
    }
  }
`;

export async function answerGuessTheSong(
  discordId: string,
  answer: string
): Promise<GuessTheSong> {
  const data = await mutate<{ answerGuessTheSong: GuessTheSong }>({
    operation,
    variables: { answer },
    authorization: tokenize(discordId),
  });

  return data.answerGuessTheSong;
}
