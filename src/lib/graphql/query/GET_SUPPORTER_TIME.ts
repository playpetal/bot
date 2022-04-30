import { gql } from "@apollo/client/core";
import { Maybe } from "petal";
import { query } from "../request";

const operation = gql`
  query GetUser($id: Int) {
    user(id: $id) {
      supporterTime
    }
  }
`;

export async function getSupporterTime({
  id,
}: {
  id?: number;
}): Promise<Maybe<number>> {
  const data = await query<{ user: Maybe<{ supporterTime: Maybe<number> }> }>({
    query: operation,
    variables: { id },
  });

  return data.user?.supporterTime || null;
}
