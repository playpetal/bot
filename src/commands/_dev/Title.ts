import { slashCommand } from "../../lib/command";
import { CONSTANTS } from "../../lib/constants";
import { createTitle } from "../../lib/graphql/mutation/dev/CREATE_TITLE";
import { grantAllTitle } from "../../lib/graphql/mutation/dev/GRANT_ALL_TITLE";
import { grantTitle } from "../../lib/graphql/mutation/dev/GRANT_TITLE";
import { revokeAllTitle } from "../../lib/graphql/mutation/dev/REVOKE_ALL_TITLE";
import { revokeTitle } from "../../lib/graphql/mutation/dev/REVOKE_TITLE";
import { getTitle } from "../../lib/graphql/query/GET_TITLE";
import { getUser } from "../../lib/graphql/query/GET_USER";
import { searchTitles } from "../../lib/graphql/query/SEARCH_TITLES";
import { displayName } from "../../lib/util/displayName";
import { Autocomplete, Run } from "../../struct/command";
import { Embed } from "../../struct/embed";
import { BotError } from "../../struct/error";

const run: Run = async function run({ interaction, user, options }) {
  const group = options.getSubcommandGroup();

  if (group?.name === "grant") {
    const titleIdStr = options.getOption<string>("title")!;

    const titleId = parseInt(titleIdStr, 10);
    const title = await getTitle({ id: titleId });

    if (!title) throw new BotError("that title doesn't exist!");

    const subcommand = options.getSubcommand()!;

    if (subcommand.name === "user") {
      const targetId = options.getOption<string>("user")!;

      const target = await getUser({ discordId: targetId });

      if (!target) throw new BotError("that user hasn't registered yet!");

      await grantTitle({
        discordId: user.discordId,
        accountId: target.id,
        titleId: title.id,
      });

      const _target = { ...target, title: title };

      const embed = new Embed().setDescription(
        `**success!**\n${displayName(
          target
        )} has been received the title ${displayName(_target)}!`
      );

      return await interaction.createMessage({ embeds: [embed] });
    } else if (subcommand.name === "all") {
      const amount = await grantAllTitle({
        discordId: user.discordId,
        titleId: title.id,
      });

      const _user = { ...user, title };

      const embed = new Embed().setDescription(
        `**success!**\n${displayName(
          _user
        )} has been given to all (${amount}) users!`
      );

      return await interaction.createMessage({ embeds: [embed] });
    }
  } else if (group?.name === "revoke") {
    const titleIdStr = options.getOption<string>("title")!;

    const titleId = parseInt(titleIdStr, 10);
    const title = await getTitle({ id: titleId });

    if (!title) throw new BotError("that title doesn't exist!");

    const subcommand = options.getSubcommand()!;

    if (subcommand.name === "user") {
      const targetId = options.getOption<string>("user")!;

      const target = await getUser({ discordId: targetId });

      if (!target) throw new BotError("that user hasn't registered yet!");

      await revokeTitle({
        discordId: user.discordId,
        accountId: target.id,
        titleId: title.id,
      });

      const _target = { ...target, title: title };

      const embed = new Embed().setDescription(
        `**success!**\n${displayName(
          target
        )} no longer has the title ${displayName(_target)}!`
      );

      return await interaction.createMessage({ embeds: [embed] });
    } else if (subcommand.name === "all") {
      const amount = await revokeAllTitle({
        discordId: user.discordId,
        titleId: title.id,
      });

      const _user = { ...user, title };

      const embed = new Embed().setDescription(
        `**success!**\n${displayName(
          _user
        )} has been removed from all (${amount}) users!`
      );

      return await interaction.createMessage({ embeds: [embed] });
    }
  }

  const subcommand = options.getSubcommand();

  if (subcommand?.name === "create") {
    const name = options.getOption<string>("title")!;
    const desc = options.getOption<string>("description");

    if (!name.includes("%u"))
      throw new BotError(
        "the title must include `%u` as a placeholder for the username."
      );

    const titleExists = await getTitle({ title: name });
    if (titleExists) throw new BotError("that title already exists.");

    const title = await createTitle(user.discordId, name, desc);

    const _user = { ...user, title };

    const embed = new Embed().setDescription(
      `**success!**\nthe title ${displayName(_user)} has been created!`
    );
    return await interaction.createMessage({ embeds: [embed] });
  }
};

const autocomplete: Autocomplete = async function autocomplete({
  interaction,
  user,
  options,
}) {
  const query = options.getOption<string>("title") || "";
  const titles = await searchTitles(query);

  const choices = titles.map((t) => {
    {
      return {
        name: t.title.replace("%u", user.username),
        value: t.id.toString(),
      };
    }
  });

  return interaction.acknowledge(choices);
};

export default slashCommand("titles")
  .desc("various tools for managing titles")
  .modOnly(true)
  .run(run)
  .autocomplete(autocomplete)
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
    name: "create",
    description: "creates a new title",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "title",
        description: "the name of the title",
        required: true,
      },
      {
        type: CONSTANTS.OPTION_TYPE.STRING,
        name: "description",
        description: "the description of the title",
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "grant",
    description: "grants a title to users",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "user",
        description: "grants a title to a specific user",
        options: [
          {
            type: CONSTANTS.OPTION_TYPE.STRING,
            name: "title",
            description: "the title to give",
            required: true,
            autocomplete: true,
          },
          {
            type: CONSTANTS.OPTION_TYPE.USER,
            name: "user",
            description: "the user to give the title to",
            required: true,
          },
        ],
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "all",
        description: "grants a title to all existing players",
        options: [
          {
            type: CONSTANTS.OPTION_TYPE.STRING,
            name: "title",
            description: "the title to give",
            required: true,
            autocomplete: true,
          },
        ],
      },
    ],
  })
  .option({
    type: CONSTANTS.OPTION_TYPE.SUBCOMMAND_GROUP,
    name: "revoke",
    description: "revokes a title from users",
    options: [
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "user",
        description: "revokes a title from a specific user",
        options: [
          {
            type: CONSTANTS.OPTION_TYPE.STRING,
            name: "title",
            description: "the title to revoke",
            required: true,
            autocomplete: true,
          },
          {
            type: CONSTANTS.OPTION_TYPE.USER,
            name: "user",
            description: "the user to revoke the title from",
            required: true,
          },
        ],
      },
      {
        type: CONSTANTS.OPTION_TYPE.SUBCOMMAND,
        name: "all",
        description: "revokes a title from all existing players",
        options: [
          {
            type: CONSTANTS.OPTION_TYPE.STRING,
            name: "title",
            description: "the title to revoke",
            required: true,
            autocomplete: true,
          },
        ],
      },
    ],
  });
