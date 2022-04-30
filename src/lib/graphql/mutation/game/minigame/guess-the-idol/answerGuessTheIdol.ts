import { gql } from "@apollo/client/core";
import { GuessTheIdol } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation AnswerGuessTheIdol($answer: String!) {
    answerGuessTheIdol(answer: $answer) {
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
    }
  }
`;

export async function answerGuessTheIdol(
  discordId: string,
  answer: string
): Promise<GuessTheIdol> {
  const data = await mutate<{ answerGuessTheIdol: GuessTheIdol }>({
    operation,
    variables: { answer },
    authorization: tokenize(discordId),
  });

  return data.answerGuessTheIdol;
}
