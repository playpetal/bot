import { gql } from "@apollo/client/core";
import { Title } from "petal";
import { graphql, GraphQLResponse } from "../..";
import { tokenize } from "../../crypto";

const mutation = gql`
  mutation CreateTitle($title: String!, $description: String) {
    createTitle(title: $title, description: $description) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function createTitle(
  discordId: string,
  title: string,
  description?: string
): Promise<Title> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { title, description },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createTitle: Title;
  }>;

  return data.createTitle;
}
