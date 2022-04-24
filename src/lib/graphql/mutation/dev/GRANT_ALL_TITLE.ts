import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation GrantAllTitle($titleId: Int!) {
    grantAllTitle(titleId: $titleId)
  }
`;

export async function grantAllTitle({
  discordId,
  titleId,
}: {
  discordId: string;
  titleId: number;
}): Promise<number> {
  const data = await mutate<{ grantAllTitle: number }>({
    operation,
    variables: { titleId },
    authorization: tokenize(discordId),
  });

  return data.grantAllTitle;
}
