import { gql } from "@apollo/client/core";
import { Announcement } from "petal";
import { query } from "../request";

const operation = gql`
  query GetAnnouncements {
    getAnnouncements {
      id
      announcement
      createdAt
    }
  }
`;

export async function getAnnouncements(): Promise<Announcement[]> {
  const data = await query<{ getAnnouncements: Announcement[] }>({
    query: operation,
    authorization: process.env.SHARED_SECRET!,
  });

  return data.getAnnouncements;
}
