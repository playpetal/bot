import { CommandInteraction, InteractionContent, TextableChannel } from "eris";

export class Courier {
  public readonly interaction: CommandInteraction<TextableChannel> | undefined;
  private responses: InteractionContent[] = [];

  constructor(interaction: CommandInteraction<TextableChannel> | undefined) {
    this.interaction = interaction;
  }

  public async send(content: InteractionContent): Promise<InteractionContent> {
    if (this.interaction) await this.interaction.createMessage(content);
    this.responses.push(content);
    return content;
  }

  public getInitialResponse(): InteractionContent | undefined {
    return this.responses[0];
  }
}
