import { emoji } from "../../../lib/util/formatting/emoji";

export function renderLeaderboard(entries: string[]): string {
  return entries
    .map(
      (v) =>
        `\`${`#${entries.indexOf(v) + 1}`.padStart(3, " ")}\` ${
          emoji.user
        } ${v}`
    )
    .join("\n");
}
