import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const ASSIGN_USER_GROUP = gql`
  mutation AssignUserGroup($accountId: Int!, $groupId: Int!) {
    assignGroup(accountId: $accountId, groupId: $groupId) {
      id
      account {
        id
        username
      }
      group {
        id
        name
      }
    }
  }
`;

export async function assignUserGroup(
  accountId: number,
  groupId: number,
  senderDiscordId: string
) {
  const mutation = (await graphql.mutate({
    mutation: ASSIGN_USER_GROUP,
    variables: { accountId, groupId },
    context: { headers: { Authorization: tokenize(senderDiscordId) } },
  })) as GraphQLResponse<{
    assignGroup: {
      id: number;
      account: { id: number; username: string };
      group: { id: number; name: string };
    };
  }>;

  return mutation.data.assignGroup;
}
