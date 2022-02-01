import { CommandInteraction } from "eris";
import { PartialUser } from "petal";
import { getUserTitles } from "../../../lib/graphql/query/GET_USER_TITLES";
import { displayName } from "../../../lib/util/displayName";
import { SlashCommand } from "../../../struct/command";
import { Embed } from "../../../struct/embed";

const run = async function (
  interaction: CommandInteraction,
  user: PartialUser
) {
  const titles = await getUserTitles(user.id);

  const embed = new Embed().setDescription(
    `<:user:930918872473796648> ${displayName(user)}'s titles\n\n${
      titles.length === 0
        ? "you don't have any titles :("
        : titles
            .map(
              (t) =>
                `<:title:930918843537309776> ${displayName({
                  username: user.username,
                  title: t,
                })}`
            )
            .join("\n")
    }`
  );

  await interaction.createMessage({ embeds: [embed] });
};

const command = new SlashCommand("titles", "shows you the titles you own", run);

export default command;
