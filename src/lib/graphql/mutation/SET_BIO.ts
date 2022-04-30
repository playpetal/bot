import { gql } from "@apollo/client/core";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
  mutation SetBio($bio: String) {
    setBio(bio: $bio) {
      bio
    }
  }
`;

export async function setBio(discordId: string, bio: string) {
  const data = await mutate<{ setBio: { bio: string | null } }>({
    operation,
    variables: { bio: bio || null },
    authorization: tokenize(discordId),
  });

  return data.setBio;
}
