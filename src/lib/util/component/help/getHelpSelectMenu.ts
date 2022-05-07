import { PartialUser, Select } from "petal";
import { help, Topic } from "../../../help/topics";

export function getHelpSelectMenu(user: PartialUser, topic?: Topic): Select {
  return {
    type: 3,
    custom_id: `select-help?${user.id}`,
    options: Object.entries(help).map(([label, { description, emoji }]) => {
      return {
        value: label,
        label,
        description,
        default: label === topic,
        emoji: { id: emoji.match(/(?<=\:)\d{16,19}(?<!\>)/gi)![0] },
      };
    }),
  };
}
