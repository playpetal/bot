import glob from "glob-promise";
import path from "path";
import { bot } from "../..";
import { Component } from "../../struct/component";
import { logger } from "../logger";

export async function loadComponents() {
  const dir = path.join(__dirname, "../../components");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  const components: Component[] = [];

  for (let match of matches) {
    try {
      const component = require(match).default as unknown;

      if (!(component instanceof Component)) continue;

      components.push(component);
    } catch (e) {
      logger.error(`Component failed to load at ${match}\n${e}`);
    }
  }

  bot.components = components;
  return;
}
