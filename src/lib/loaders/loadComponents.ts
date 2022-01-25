import glob from "glob-promise";
import path from "path";
import { Component } from "../../struct/component";

export async function loadComponents() {
  const dir = path.join(__dirname, "../../components");
  const matches = await glob(`${dir}/**/*.ts`);

  const components: Component[] = [];

  for (let match of matches) {
    try {
      const component = require(match).default as Component;

      components.push(component);
    } catch (e) {
      console.error(`Component failed to load at ${match}\n${e}`);
    }
  }

  return components;
}
