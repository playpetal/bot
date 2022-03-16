import { Run, GroupGender } from "petal";
import { createGroup } from "../../../../../../lib/graphql/mutation/CREATE_GROUP";
import { Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const name = options.getOption<string>("name");
  const creation = options.getOption<string>("creation");
  const gender = options.getOption<"male" | "female" | "coed">("gender");

  const group = await createGroup(
    user.discordId,
    name!,
    creation ? new Date(creation) : undefined,
    gender?.toUpperCase() as GroupGender | undefined
  );

  const embed = new Embed().setDescription(
    `the group **${group.name}** has been created!`
  );

  return interaction.createMessage({ embeds: [embed] });
};

export default run;
