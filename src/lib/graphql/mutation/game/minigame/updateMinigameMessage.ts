import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation UpdateMinigameMessage(
    $messageId: String!
    $channelId: String!
    $guildId: String!
  ) {
    updateMinigameMessage(
      messageId: $messageId
      channelId: $channelId
      guildId: $guildId
    )
  }
`;

export async function updateMinigameMessage(
  account: PartialUser,
  {
    messageId,
    channelId,
    guildId,
  }: { messageId: string; channelId: string; guildId: string }
) {
  const data = await mutate<{ updateMinigameMessage: boolean }>({
    operation,
    variables: { messageId, channelId, guildId },
    authorization: tokenize(account.discordId),
  });

  return data.updateMinigameMessage;
}
