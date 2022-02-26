import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../../crypto";

const query = gql`
  query GetWord {
    word
  }
`;

export async function getWord(discordId: string) {
  const { data } = (await graphql.query({
    query,
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    word: string;
  }>;

  return data.word;
}
