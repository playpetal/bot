import { gql } from "@apollo/client/core";
import { PartialUser } from "petal";
import { tokenize } from "../crypto";
import { mutate } from "../request";

const operation = gql`
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
  const data = await mutate<{ setUserTitle: PartialUser }>({
    operation,
    variables: { id },
    authorization: tokenize(discordId),
  });

  return data.setUserTitle;
}
