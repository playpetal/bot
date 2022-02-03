import { PartialUser } from "petal";

export function displayName({ username, title }: PartialUser): string {
  if (!title) return `**${username}**`;
  return title.title.title.replace("%u", `**${username}**`);
}
