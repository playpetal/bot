import { Embed } from "../../../struct/embed";
import { emoji } from "../../util/formatting/emoji";

export function getHelpNotFoundEmbed(): Embed {
  const embed = new Embed().setDescription(
    `${emoji.bloom} **petal help center (not found)**` +
      `\ni couldn't find any information on that topic!` +
      `\nplease select a topic from one of the choices, or [report this](https://discord.gg/petal) if it's in error.`
  );

  return embed;
}
