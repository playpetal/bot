import { SlashCommandOption } from "petal";
import { createAccount } from "../../lib/graphql/mutation/CREATE_ACCOUNT";
import { getUserPartial } from "../../lib/graphql/query/GET_USER_PARTIAL";
import { Run, SlashCommand } from "../../struct/command";
import { Embed, ErrorEmbed } from "../../struct/embed";

const run: Run = async function ({ interaction, options }) {
  const id = interaction.member!.user.id;
  const user = await getUserPartial(id);

  if (user)
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("you already have an account!")],
      flags: 64,
    });

  const username = options.getOption<string>("username");

  if (!username)
    return await interaction.createMessage({
      embeds: [new ErrorEmbed("please enter a username.")],
      flags: 64,
    });

  if (username.length > 20 || username.length < 2) {
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed("your username must be between 2 and 20 characters."),
      ],
      flags: 64,
    });
  }

  if (RegExp(/[^A-Za-z0-9 _-]+/gm).exec(username))
    return await interaction.createMessage({
      embeds: [
        new ErrorEmbed(
          "your username contains invalid characters.\nyou may only use alphanumeric characters, spaces, hyphens, and underscores."
        ),
      ],
      flags: 64,
    });

  const account = await createAccount(id, username);

  const embed = new Embed().setDescription(
    `<:user:930918872473796648> **account created!** welcome to petal, **${account.username}**!\nfeel free to join us at https://discord.gg/petal for news and support!`
  );

  await interaction.createMessage({ embeds: [embed] });
};

export default new SlashCommand("register")
  .desc("sign up with this command to start playing petal!")
  .run(run)
  .option({
    name: "username",
    description: "your desired username",
    type: "string",
    required: true,
  } as SlashCommandOption<"string">);
