import { Run, Gender } from "petal";
import { createCharacter } from "../../../../../../lib/graphql/mutation/CREATE_CHARACTER";
import { Embed } from "../../../../../../struct/embed";

const run: Run = async ({ courier, options }) => {
  const name = options.getOption<string>("name");
  const birthday = options.getOption<string>("birthday");
  const gender = options.getOption<"male" | "female" | "nonbinary">("gender");

  const date = birthday ? new Date(birthday) : undefined;

  const character = await createCharacter(
    courier.interaction!.member!.user.id,
    name!,
    date,
    gender?.toUpperCase() as Gender | undefined
  );

  const embed = new Embed().setDescription(
    `the character **${character.name}** has been created!`
  );

  await courier.send({ embeds: [embed] });
  return;
};

export default run;
