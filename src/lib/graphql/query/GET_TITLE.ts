import { gql } from "@apollo/client/core";
import { Maybe, Title } from "petal";
import { query } from "../request";

const operation = gql`
  query GetTitle($id: Int, $title: String) {
    title(id: $id, title: $title) {
      id
      title
      description
      ownedCount
    }
  }
`;

export async function getTitle({
  id,
  title,
}: {
  id?: number;
  title?: string;
}): Promise<Maybe<Title>> {
  const data = await query<{ title: Maybe<Title> }>({
    query: operation,
    variables: { id, title },
  });

  return data.title;
}
