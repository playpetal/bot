import { ComponentInteraction } from "eris";
import { PartialUser } from "petal";

type RunComponent = (
  interaction: ComponentInteraction,
  user: PartialUser
) => Promise<unknown> | unknown;

export class Component {
  customId: string;

  run: RunComponent;

  constructor(customId: string, run: RunComponent) {
    this.customId = customId;
    this.run = run;
  }
}
