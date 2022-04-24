import { gql } from "@apollo/client/core";
import { PartialUser, Release } from "petal";
import { tokenize } from "../../../crypto";
import { mutate } from "../../../request";

const operation = gql`
  mutation CreateRelease {
    createRelease {
      id
      droppable
    }
  }
`;

export async function createRelease(user: PartialUser): Promise<Release> {
  const data = await mutate<{ createRelease: Release }>({
    operation,
    authorization: tokenize(user.discordId),
  });

  return data.createRelease;
}
