import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const CREATE_ACCOUNT = gql`
  mutation CreateAccount($username: String!) {
    createAccount(username: $username) {
      id
      username
    }
  }
`;

export async function createAccount(discordId: string, username: string) {
  const mutation = (await graphql.mutate({
    mutation: CREATE_ACCOUNT,
    variables: { username },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createAccount: { id: number; username: string };
  }>;

  return mutation.data.createAccount;
}
