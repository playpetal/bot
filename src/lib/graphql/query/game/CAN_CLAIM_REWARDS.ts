import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { query } from "../../request";

const operation = gql`
  query CanClaimRewards {
    canClaimRewards
  }
`;

export async function canClaimRewards(discordId: string): Promise<number> {
  const data = await query<{ canClaimRewards: number }>({
    query: operation,
    authorization: tokenize(discordId),
  });

  return data.canClaimRewards;
}
