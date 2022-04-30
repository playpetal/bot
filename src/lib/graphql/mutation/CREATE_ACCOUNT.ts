import { gql } from "@apollo/client/core";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
  mutation CreateAccount($username: String!) {
    createAccount(username: $username) {
      id
      username
    }
  }
`;

export async function createAccount(discordId: string, username: string) {
  const data = await mutate<{
    createAccount: { id: number; username: string };
  }>({
    operation,
    variables: { username },
    authorization: tokenize(discordId),
  });

  return data.createAccount;
}
