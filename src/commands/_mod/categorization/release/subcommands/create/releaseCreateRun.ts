import { Run } from "petal";
import { createRelease } from "../../../../../../lib/graphql/mutation/categorization/release/CREATE_RELEASE";
import { Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user }) => {
  const release = await createRelease(user);

  const embed = new Embed().setDescription(
    `release **${release.id}** has been created!\nit's currently undroppable.`
  );

  return interaction.createMessage({ embeds: [embed] });
};

export default run;
