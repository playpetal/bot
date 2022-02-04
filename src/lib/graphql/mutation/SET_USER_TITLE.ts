import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation SetUserTitle($id: Int!) {
    setUserTitle(id: $id) {
      id
      discordId
      username
      title {
        title
      }
    }
  }
`;

export async function setUserTitle(discordId: string, id: number) {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { id },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    setUserTitle: PartialUser;
  }>;

  return data.setUserTitle;
}
