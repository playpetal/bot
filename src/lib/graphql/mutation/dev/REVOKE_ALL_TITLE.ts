import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation RevokeAllTitle($titleId: Int!) {
    revokeAllTitle(titleId: $titleId)
  }
`;

export async function revokeAllTitle({
  discordId,
  titleId,
}: {
  discordId: string;
  titleId: number;
}): Promise<number> {
  const data = await mutate<{ revokeAllTitle: number }>({
    operation,
    variables: { titleId },
    authorization: tokenize(discordId),
  });

  return data.revokeAllTitle;
}
