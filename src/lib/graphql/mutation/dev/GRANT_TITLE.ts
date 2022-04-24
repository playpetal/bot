import { gql } from "@apollo/client/core";
import { TitleInventory } from "petal";
import { tokenize } from "../../crypto";
import { mutate } from "../../request";

const operation = gql`
  mutation GrantTitle($accountId: Int!, $titleId: Int!) {
    grantTitle(accountId: $accountId, titleId: $titleId) {
      id
      account {
        id
        username
        discordId
        title {
          title
        }
      }
      title {
        title
      }
    }
  }
`;

export async function grantTitle({
  discordId,
  accountId,
  titleId,
}: {
  discordId: string;
  accountId: number;
  titleId: number;
}): Promise<TitleInventory> {
  const data = await mutate<{ grantTitle: TitleInventory }>({
    operation,
    variables: { accountId, titleId },
    authorization: tokenize(discordId),
  });

  return data.grantTitle;
}
