import { ComponentInteraction } from "eris";

type RunComponent = (
  interaction: ComponentInteraction,
  user: { id: number; username: string; title: { title: { title: string } } }
) => Promise<unknown> | unknown;

export class Component {
  customId: string;

  run: RunComponent;

  constructor(customId: string, run: RunComponent) {
    this.customId = customId;
    this.run = run;
  }
}
