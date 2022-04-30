import { gql } from "@apollo/client/core";
import { PartialUser, Release } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation UpdateRelease($id: Int!, $droppable: Boolean) {
    updateRelease(id: $id, droppable: $droppable) {
      id
      droppable
    }
  }
`;

export async function updateRelease(
  user: PartialUser,
  id: number,
  droppable?: boolean
): Promise<Release> {
  const data = await mutate<{ updateRelease: Release }>({
    operation,
    variables: { id, droppable },
    authorization: tokenize(user.discordId),
  });

  return data.updateRelease;
}
