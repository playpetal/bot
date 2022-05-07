import { Embed } from "../../../../../struct/embed";
import { emoji } from "../../../formatting/emoji";

export function getHelpMinigamesMenu(): Embed {
  const embed = new Embed()
    .setDescription(
      `${emoji.bloom} **petal help center (minigames)**` +
        `\nthere are a number of minigames available in petal for you to enjoy!` +
        `\nyou can claim **3 rewards per hour**, with every additional win awarding ${emoji.petals} **1**.` +
        `\neveryone's timer resets on every new hour (e.g. 8:00), so there's no need for math!` +
        `\n\n**list of minigames**` +
        `\n**/trivia** - 30 seconds to answer a random question!` +
        `\n**/song** - 30 seconds to guess a song from a random 10-second snippet!` +
        `\n\n**bias list**` +
        `\nyou can force minigames to use your bias list by using the following command:` +
        `\n**/settings toggle minigames-use-bias-list**`
    )
    .setFooter(
      `got a cool idea for a minigame? let us know in the official server!`
    );

  return embed;
}
