import { gql } from "@apollo/client/core";
import { MinigameType } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation StartMinigame {
    startMinigame($type: MinigameType!, $gender: Gender, $groupGender: GroupGender, $messageId: String, $channelId: String, $guildId: String) {
        accountId
    messageId
    channelId
    guildId
    type
    data {
      attempts
      elapsed
      type
      isGendered
      startedAt
      correct
    }
    }
  }
`;

export async function startMinigame(accountId: string, type: MinigameType) {
  const data = await mutate<{
    startMinigame: {};
  }>({ operation, authorization: tokenize(accountId), variables: { type } });

  console.log(data.startMinigame);

  return data.startMinigame;
}
