import { Card } from "petal";
import { emoji } from "./emoji";

export function formatCard(
  card: Card,
  options: {
    code?: boolean;
    icon?: boolean;
    group?: boolean;
    subgroup?: boolean;
  } = {
    code: true,
    icon: true,
    group: true,
    subgroup: true,
  }
): string {
  let str = "";

  if (options.code) str += `\`${card.id.toString(36)}\` `;
  if (options.icon)
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
  if (options.group && card.prefab.group)
    str += `**${card.prefab.group.name}** `;
  if (options.subgroup && card.prefab.subgroup)
    str += `**${card.prefab.subgroup.name}** `;

  str += card.prefab.character.name;

  return str;
}
