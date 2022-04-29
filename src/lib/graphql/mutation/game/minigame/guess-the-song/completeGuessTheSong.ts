import { gql } from "@apollo/client/core";
import { Card, Maybe, Reward } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
  mutation CompleteGuessTheSong($reward: Reward!) {
    completeGuessTheSong(reward: $reward) {
      account {
        currency
        premiumCurrency
      }
      card {
        id
        tag {
          emoji
          tag
        }
        owner {
          username
          title {
            title
          }
        }
        issue
        quality
        tint
        hasFrame
        prefab {
          id
          character {
            name
          }
          group {
            name
          }
          subgroup {
            name
          }
        }
      }
    }
  }
`;

export async function completeGuessTheSong(
  discordId: string,
  reward: Reward
): Promise<{
  account: { currency: number; premiumCurrency: number };
  card: Maybe<Card>;
}> {
  const data = await mutate<{
    completeGuessTheSong: {
      account: { currency: number; premiumCurrency: number };
      card: Maybe<Card>;
    };
  }>({
    operation,
    variables: { reward },
    authorization: tokenize(discordId),
  });

  return data.completeGuessTheSong;
}
