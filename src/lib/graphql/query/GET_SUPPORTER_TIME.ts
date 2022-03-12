import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse, Maybe } from "..";

const query = gql`
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
  const { data } = (await graphql.query({
    query,
    variables: { id },
  })) as GraphQLResponse<{
    user: Maybe<{ supporterTime: Maybe<number> }>;
  }>;

  return data.user?.supporterTime || null;
}
