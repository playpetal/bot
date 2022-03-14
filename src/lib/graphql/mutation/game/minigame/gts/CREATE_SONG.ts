import { gql } from "@apollo/client/core";
import { Song } from "petal";
import { graphql, GraphQLResponse } from "../../../..";
import { tokenize } from "../../../../crypto";

const mutation = gql`
  mutation CreateSong(
    $title: String!
    $url: String!
    $groupId: Int
    $soloistId: Int
    $releaseId: Int
  ) {
    createSong(
      title: $title
      url: $url
      groupId: $groupId
      soloistId: $soloistId
      releaseId: $releaseId
    ) {
      id
      title
      group {
        name
      }
      soloist {
        name
      }
      release {
        id
      }
    }
  }
`;

export async function createSong(
  discordId: string,
  {
    title,
    url,
    groupId,
    soloistId,
    releaseId,
  }: {
    title: string;
    url: string;
    groupId?: number;
    soloistId?: number;
    releaseId?: number;
  }
): Promise<Song> {
  const { data } = (await graphql.mutate({
    mutation,
    variables: { title, url, groupId, soloistId, releaseId },
    context: { headers: { Authorization: tokenize(discordId) } },
  })) as GraphQLResponse<{
    createSong: Song;
  }>;

  return data.createSong;
}
