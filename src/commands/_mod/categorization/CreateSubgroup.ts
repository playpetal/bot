import {
  CommandInteraction,
  Constants,
  InteractionDataOptionsWithValue,
} from "eris";
import { createSubgroup } from "../../../lib/graphql/mutation/CREATE_SUBGROUP";
import { getUser } from "../../../lib/graphql/query/GET_USER";
import { SlashCommand } from "../../../struct/command";
import { Embed, ErrorEmbed } from "../../../struct/embed";

async function run(interaction: CommandInteraction) {
  const account = (await getUser(interaction.member!.user.id))!;

  if (!account.groups.find((g) => g.group.name === "Release Manager"))
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you don't have permission to do that :(")],
      flags: 64,
    });

  const options = interaction.data.options as InteractionDataOptionsWithValue[];

  const subgroupName = options.find((o) => o.name === "name")!.value as string;
  const subgroupCreation = options.find((o) => o.name === "creation")?.value as
    | string
    | undefined;

  const date = subgroupCreation ? new Date(subgroupCreation) : undefined;

  const subgroup = await createSubgroup(
    interaction.member!.user.id,
    subgroupName,
    date
  );

  const embed = new Embed().setDescription(
    `the subgroup **${subgroup.name}** has been created!`
  );

  await interaction.createMessage({ embeds: [embed] });
}

const command = new SlashCommand(
  "createsubgroup",
  "creates a new subgroup",
  run,
  [
    {
      name: "name",
      description: "the name of the subgroup",
      type: Constants.ApplicationCommandOptionTypes.STRING,
      required: true,
    },
    {
      name: "creation",
      description:
        "the date that the subgroup was created or formed (release date, etc)",
      type: Constants.ApplicationCommandOptionTypes.STRING,
    },
  ]
);

export default command;
