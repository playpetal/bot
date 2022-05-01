import { gql } from "@apollo/client/core";
import { Bias, PartialUser } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation RemoveBias($groupId: Int!) {
    removeBias(groupId: $groupId) {
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

export async function removeBias(
  account: PartialUser,
  bias: Bias
): Promise<Bias> {
  const data = await mutate<{
    removeBias: Bias;
  }>({
    operation,
    variables: { groupId: bias.group.id },
    authorization: tokenize(account.discordId),
  });

  return data.removeBias;
}
