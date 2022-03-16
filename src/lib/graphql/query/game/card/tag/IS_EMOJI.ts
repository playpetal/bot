import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../../..";

const query = gql`
  query IsEmoji($emoji: String!) {
    isEmoji(emoji: $emoji)
  }
`;

export async function isEmoji(emoji: string): Promise<boolean> {
  const { data } = (await graphql.query({
    query,
    variables: { emoji },
  })) as GraphQLResponse<{
    isEmoji: boolean;
  }>;

  return data.isEmoji;
}
