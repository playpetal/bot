import { gql } from "@apollo/client/core";
import { Maybe, Release } from "petal";
import { tokenize } from "../../../crypto";
import { query } from "../../../request";

const operation = gql`
  query GetRelease($id: Int!) {
    release(id: $id) {
      id
      droppable
    }
  }
`;

export async function getRelease(
  id: number,
  discordId: string
): Promise<Maybe<Release>> {
  const data = await query<{ release: Maybe<Release> }>({
    query: operation,
    variables: { id },
    authorization: tokenize(discordId),
  });

  return data.release;
}
