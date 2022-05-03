import { gql } from "@apollo/client/core";
import { Trivia } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation AnswerTrivia($answer: String!) {
    answerTrivia(answer: $answer) {
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

export async function answerTrivia(
  discordId: string,
  answer: string
): Promise<Trivia> {
  const data = await mutate<{ answerTrivia: Trivia }>({
    operation,
    variables: { answer },
    authorization: tokenize(discordId),
  });

  return data.answerTrivia;
}
