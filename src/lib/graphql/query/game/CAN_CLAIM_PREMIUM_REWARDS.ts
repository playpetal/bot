import { gql } from "@apollo/client/core";
import { tokenize } from "../../crypto";
import { query } from "../../request";

const operation = gql`
  query CanClaimPremiumRewards {
    canClaimPremiumRewards
  }
`;

export async function canClaimPremiumRewards(
  discordId: string
): Promise<number> {
  const data = await query<{ canClaimPremiumRewards: number }>({
    query: operation,
    authorization: tokenize(discordId),
  });

  return data.canClaimPremiumRewards;
}
