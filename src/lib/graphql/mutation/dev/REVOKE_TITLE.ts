import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation RevokeTitle($accountId: Int!, $titleId: Int!) {
    revokeTitle(accountId: $accountId, titleId: $titleId)
  }
`;

export async function revokeTitle({
  discordId,
  accountId,
  titleId,
}: {
  discordId: string;
  accountId: number;
  titleId: number;
}): Promise<number> {
  const data = await mutate<{ revokeTitle: number }>({
    operation,
    variables: { accountId, titleId },
    authorization: tokenize(discordId),
  });

  return data.revokeTitle;
}
