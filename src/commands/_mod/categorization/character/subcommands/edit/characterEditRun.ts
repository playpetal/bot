import { Run, Gender } from "petal";
import { updateCharacter } from "../../../../../../lib/graphql/mutation/UPDATE_CHARACTER";
import { getCharacter } from "../../../../../../lib/graphql/query/categorization/character/getCharacter";
import { ErrorEmbed, Embed } from "../../../../../../struct/embed";

const run: Run = async ({ interaction, user, options }) => {
  const name = options.getOption<string>("name");
  const birthday = options.getOption<string>("birthday");
  const gender = options.getOption<"male" | "female" | "nonbinary">("gender");

  const strCharacterId = options.getOption<string>("character")!;
  const characterId = parseInt(strCharacterId, 10);

  if (isNaN(characterId)) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please select a character from the dropdown!")],
    });
  }

  const character = await getCharacter(characterId);

  if (!character) {
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please select a character from the dropdown!")],
    });
  }

  if (!name && birthday === undefined && gender === undefined) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("you didn't change anything about the character."),
      ],
      flags: 64,
    });
  }

  const date = birthday ? new Date(birthday) : undefined;

  const newCharacter = await updateCharacter(
    user.discordId,
    character.id,
    name,
    date,
    gender?.toUpperCase() as Gender | undefined
  );

  await interaction.createMessage({
    embeds: [
      new Embed().setDescription(
        `the character **${newCharacter.name}** has been updated!\ncheck **/characterinfo \`${newCharacter.name}\`** to see the new info!`
      ),
    ],
  });
  return;
};

export default run;
