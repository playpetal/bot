import { gql } from "@apollo/client/core";
import { Song } from "petal";
import { tokenize } from "../../../../crypto";
import { mutate } from "../../../../request";

const operation = gql`
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
  const data = await mutate<{ createSong: Song }>({
    operation,
    variables: { title, url, groupId, soloistId, releaseId },
    authorization: tokenize(discordId),
  });

  return data.createSong;
}
