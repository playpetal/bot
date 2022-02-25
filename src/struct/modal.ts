import { ModalSubmitInteraction } from "eris";
import { PartialUser } from "petal";

export type RunModal = ({
  interaction,
  user,
}: {
  interaction: ModalSubmitInteraction;
  user: PartialUser;
}) => Promise<unknown> | unknown;

export class Modal {
  readonly customId: string;

  private _run: RunModal | undefined;

  constructor(customId: string) {
    this.customId = customId;
  }

  public async execute({ interaction, user }: { interaction: any; user: any }) {
    if (!this._run)
      throw new Error(`'this._run' not specified in modal '${this.customId}'`);

    return this._run({
      interaction,
      user,
    });
  }

  public run(run: RunModal) {
    this._run = run;
    return this;
  }
}
