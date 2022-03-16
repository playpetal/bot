import { Card } from "petal";
import { emoji } from "./emoji";

export function formatCard(
  card: Card,
  options: {
    code?: boolean;
    icon?: boolean;
    group?: boolean;
    subgroup?: boolean;
    issue?: boolean;
    tag?: boolean;
  } = {
    code: true,
    icon: true,
    group: true,
    subgroup: true,
    issue: true,
    tag: true,
  }
): string {
  let str = "";

  if (options.tag !== false) str += `${card.tag?.emoji || "◽"} `;

  if (options.code !== false) str += `\`${card.id.toString(16)}\` `;
  if (options.icon !== false)
    str += `${
      emoji[
        card.quality.toLowerCase() as
          | "seed"
          | "sprout"
          | "bud"
          | "flower"
          | "bloom"
      ]
    } `;
  if (options.group !== false && card.prefab.group)
    str += `**${card.prefab.group.name}** `;
  if (options.subgroup !== false && card.prefab.subgroup)
    str += `**${card.prefab.subgroup.name}** `;

  str += card.prefab.character.name;

  if (options.issue !== false) str += ` \`#${card.issue}\``;

  return str;
}
