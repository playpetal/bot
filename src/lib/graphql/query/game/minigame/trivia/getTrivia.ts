import { gql } from "@apollo/client/core";
import { Maybe, PartialUser, Trivia } from "petal";
import { tokenize } from "../../../../crypto";
import { query } from "../../../../request";

const operation = gql`
  query GetTrivia {
    getTrivia {
      type
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

export async function getTrivia(account: PartialUser): Promise<Maybe<Trivia>> {
  const data = await query<{ getTrivia: Maybe<Trivia> }>({
    query: operation,
    authorization: tokenize(account.discordId),
  });

  return data.getTrivia;
}
