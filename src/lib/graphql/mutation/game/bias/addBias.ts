import { gql } from "@apollo/client/core";
import { Bias, Group, PartialUser } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation AddBias($groupId: Int!) {
    addBias(groupId: $groupId) {
      account {
        id
        username
        discordId
        title {
          title
        }
      }
      group {
        id
        name
        creation
        gender
        aliases {
          alias
        }
      }
    }
  }
`;

export async function addBias(
  account: PartialUser,
  group: Group
): Promise<Bias> {
  const data = await mutate<{
    addBias: Bias;
  }>({
    operation,
    variables: { groupId: group.id },
    authorization: tokenize(account.discordId),
  });

  return data.addBias;
}
