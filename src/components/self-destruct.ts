import { Component, RunComponent } from "../struct/component";
import { BotError } from "../struct/error";

const run: RunComponent = async function ({ interaction, user }) {
  const [_customId, accountIdStr] = interaction.data.custom_id.split("?");
  if (!accountIdStr) return;

  const accountId = parseInt(accountIdStr);

  if (user.id !== accountId)
    throw new BotError("**woah there!**\nthose buttons aren't for you.");

  try {
    await interaction.deleteOriginalMessage();
  } catch {}

  return;
};

const component = new Component("self-destruct").run(run).autoack();

export default component;
