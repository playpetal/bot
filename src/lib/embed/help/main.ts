import { Embed } from "../../../struct/embed";
import { emoji } from "../../util/formatting/emoji";

export function getHelpMainEmbed(): Embed {
  const embed = new Embed().setDescription(
    `${emoji.bloom} **petal help center (main page)**` +
      `\nthis serves as a general repository of information about petal.` +
      `\nplease select a topic with the dropdown!` +
      `\n\nfeel free to join the [official server](https://discord.gg/petal) if you need further help!`
  );

  return embed;
}
