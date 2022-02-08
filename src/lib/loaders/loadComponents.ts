import glob from "glob-promise";
import path from "path";
import { Component } from "../../struct/component";
import { logger } from "../logger";

export async function loadComponents() {
  const dir = path.join(__dirname, "../../components");
  const matches = await glob(`${dir}/**/*.[jt]s`);

  const components: Component[] = [];

  for (let match of matches) {
    try {
      const component = require(match).default as Component;

      components.push(component);
    } catch (e) {
      logger.error(`Component failed to load at ${match}\n${e}`);
    }
  }

  return components;
}
