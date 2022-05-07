import { Embed } from "../../struct/embed";
import { getHelpMinigamesMenu } from "../util/component/help/topics/getHelpMinigamesMenu";
import { getHelpRollingMenu } from "../util/component/help/topics/getHelpRollingMenu";
import { emoji } from "../util/formatting/emoji";

export type Topic = typeof helpTopics[number];
type Help = { getEmbed: () => Embed; description: string; emoji: string };
export const helpTopics = ["minigames", "rolling"] as const;

export const help: { [key in Topic]?: Help } = {
  minigames: {
    getEmbed: getHelpMinigamesMenu,
    description: "shows information about minigames and rewards",
    emoji: emoji.bloom,
  },
  rolling: {
    getEmbed: getHelpRollingMenu,
    description: "shows information about rolling mechanics",
    emoji: emoji.dice,
  },
} as const;
