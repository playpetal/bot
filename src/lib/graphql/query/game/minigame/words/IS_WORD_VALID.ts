import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "../../../..";

const query = gql`
  query isWordValid($word: String!) {
    isWordValid(word: $word)
  }
`;

export async function isWordValid(word: string) {
  const { data } = (await graphql.query({
    query,
    variables: { word },
  })) as GraphQLResponse<{
    isWordValid: boolean;
  }>;

  return data.isWordValid;
}
