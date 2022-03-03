import { gql } from "@apollo/client/core";
import { graphql, GraphQLResponse } from "..";
import { tokenize } from "../crypto";

const SET_BIO = gql`
  mutation SetBio($bio: String) {
    setBio(bio: $bio) {
      bio
    }
  }
`;

export async function setBio(discordId: string, bio: string) {
  const mutation = (await graphql.mutate({
    mutation: SET_BIO,
    variables: { bio: bio || null },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    setBio: { bio: string | null };
  }>;

  return mutation.data.setBio;
}
