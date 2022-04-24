import { Run } from "petal";
import { createSubgroup } from "../../../../../../lib/graphql/mutation/CREATE_SUBGROUP";
import { Embed } from "../../../../../../struct/embed";

const run: Run = async ({ courier, user, options }) => {
  const name = options.getOption<string>("name")!;
  const creation = options.getOption<string>("creation");

  const subgroup = await createSubgroup(
    user.discordId,
    name,
    creation ? new Date(creation) : undefined
  );

  const embed = new Embed().setDescription(
    `the subgroup **${subgroup.name}** has been created!`
  );

  return courier.send({ embeds: [embed] });
};

export default run;
