import { gql } from "@apollo/client/core";
import { Maybe, Release } from "petal";
import { query } from "../../../request";

const operation = gql`
  query GetLastRelease {
    lastRelease {
      id
      droppable
    }
  }
`;

export async function getLastRelease(): Promise<Maybe<Release>> {
  const data = await query<{ lastRelease: Maybe<Release> }>({
    query: operation,
  });

  return data.lastRelease;
}
