import { ComponentInteraction } from "eris";
import { PartialUser } from "petal";

export type RunComponent = ({
  interaction,
  user,
}: {
  interaction: ComponentInteraction;
  user: PartialUser;
}) => Promise<unknown> | unknown;

export class Component {
  readonly customId: string;

  public autoAck: boolean = false;

  private _run: RunComponent | undefined;

  constructor(customId: string) {
    this.customId = customId;
  }

  public async execute({ interaction, user }: { interaction: any; user: any }) {
    if (!this._run)
      throw new Error(
        `'this._run' not specified in component '${this.customId}'`
      );

    return this._run({
      interaction,
      user,
    });
  }

  public run(run: RunComponent) {
    this._run = run;
    return this;
  }

  public autoack() {
    this.autoAck = true;
    return this;
  }
}
