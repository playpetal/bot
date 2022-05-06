import { gql } from "@apollo/client/core";
import { Group } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation CreateTriviaQuestion(
    $question: String!
    $solution: String!
    $incorrectAnswers: [String!]!
    $groupId: Int!
  ) {
    createTriviaQuestion(
      question: $question
      solution: $solution
      incorrectAnswers: $incorrectAnswers
      groupId: $groupId
    ) {
      id
      group {
        name
        creation
      }
      question
      solutions {
        id
        answer
        correct
      }
    }
  }
`;

export async function createTriviaQuestion(
  discordId: string,
  question: string,
  solution: string,
  incorrectAnswers: [string, string, string],
  group: Group
): Promise<{
  id: number;
  group: { name: string; creation: Date };
  question: string;
  solutions: { id: number; answer: string; correct: boolean }[];
}> {
  const data = await mutate<{
    createTriviaQuestion: {
      id: number;
      group: { name: string; creation: Date };
      question: string;
      solutions: { id: number; answer: string; correct: boolean }[];
    };
  }>({
    operation,
    variables: { question, solution, incorrectAnswers, groupId: group.id },
    authorization: tokenize(discordId),
  });

  return data.createTriviaQuestion;
}
