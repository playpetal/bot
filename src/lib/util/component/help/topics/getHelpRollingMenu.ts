import { Embed } from "../../../../../struct/embed";
import { emoji } from "../../../formatting/emoji";

export function getHelpRollingMenu(): Embed {
  const embed = new Embed().setDescription(
    `${emoji.bloom} **petal help center (rolling)**` +
      `\nyou can save up ${emoji.petals} **petals** to use to roll cards at any time!` +
      `\npetals can be earned by playing **minigames** and **burning cards**.` +
      `\n\n**rolling mechanics**` +
      `\nit costs ${emoji.petals} **10** per card to roll normally, or ${emoji.petals} **15** per card to roll a specific gender.` +
      `\nall cards are equally likely to be rolled, unless stated otherwise in the release notes!` +
      `\n\n__to avoid spam, we highly recommend rolling multiple cards in the same roll!__` +
      `\nit's easier on the bot and Discord compared to rolling with consecutive commands.`
  );

  return embed;
}
