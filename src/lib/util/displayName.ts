export function displayName({
  username,
  title,
}: {
  username: string;
  title: { title: { title: string } } | null;
}): string {
  if (!title) return `**${username}**`;
  return title.title.title.replace("%u", `**${username}**`);
}
