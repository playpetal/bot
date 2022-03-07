import { ApplicationCommand } from "eris";
import { DiscordSlashCommandOption, SlashCommandOption } from "petal";
import { bot } from "../..";
import { SlashCommand } from "../../struct/command";
import { optionTypes } from "../../struct/options";
import { slashCommandEquals } from "../util/slashCommandEquals";

export async function processCommands(
  commands: SlashCommand[],
  serverId?: string
): Promise<void> {
  // array of slash commands that have been added to Discord already
  let applicationCommands: ApplicationCommand[] = [];

  if (serverId) {
    applicationCommands = await bot.getGuildCommands(serverId);
  } else applicationCommands = await bot.getCommands();

  for (let cmd of applicationCommands) {
    const command = commands.find((c) => c.name === cmd.name);

    // if the command does not exist locally, delete it from Discord
    if (!command) {
      if (serverId) {
        await bot.deleteGuildCommand(serverId, cmd.id);
      } else await bot.deleteCommand(cmd.id);

      continue;
    }

    // check for slash command equality in name, description, and options
    const isEqual = slashCommandEquals(command, cmd);
    const parsed = { ...command, options: parseOptions(command.options) };

    if (!isEqual) {
      if (serverId) {
        // @ts-ignore
        await bot.editGuildCommand(serverId, cmd.id, parsed);
        // @ts-ignore
      } else await bot.editCommand(cmd.id, parsed);
    }
  }

  // filter for 'new' commands that exist locally, but not on Discord
  const newCommands = commands.filter(
    (c) => !applicationCommands.find((g) => g.name === c.name)
  );

  for (let command of newCommands) {
    const parsed = { ...command, options: parseOptions(command.options) };

    if (serverId) {
      // @ts-ignore
      await bot.createGuildCommand(serverId, parsed);
      // @ts-ignore
    } else await bot.createCommand(parsed);
  }

  return;
}

export function parseOptions(
  options: SlashCommandOption<keyof typeof optionTypes>[]
) {
  const parsed = [];

  for (let opt of options) {
    const type = optionTypes[opt.type];
    const _opt = { ...opt, type };
    delete _opt.ephemeral;

    if (type === 1) {
      parsed.push(_opt as DiscordSlashCommandOption<1>);
    } else if (type === 2) {
      parsed.push(_opt as DiscordSlashCommandOption<2>);
    } else if (type === 3) {
      parsed.push(_opt as DiscordSlashCommandOption<3>);
    } else if (type === 4) {
      parsed.push(_opt as DiscordSlashCommandOption<4>);
    } else if (type === 5) {
      parsed.push(_opt as DiscordSlashCommandOption<5>);
    } else if (type === 6) {
      parsed.push(_opt as DiscordSlashCommandOption<6>);
    } else if (type === 7) {
      parsed.push(_opt as DiscordSlashCommandOption<7>);
    } else if (type === 8) {
      parsed.push(_opt as DiscordSlashCommandOption<8>);
    } else if (type === 9) {
      parsed.push(_opt as DiscordSlashCommandOption<9>);
    } else if (type === 10) {
      parsed.push(_opt as DiscordSlashCommandOption<10>);
    } else if (type === 11) {
      // @ts-ignore
      parsed.push(_opt as DiscordSlashCommandOption<11>);
    }

    if (opt.options) {
      // @ts-ignore - i don't know how to change the type of this nested options object.
      //              it works fine.
      _opt.options = parseOptions(opt.options);
    }
  }

  return parsed;
}
