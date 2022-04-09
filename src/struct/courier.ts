import {
  CommandInteraction,
  InteractionContent,
  Message,
  TextableChannel,
} from "eris";

export class Courier {
  public readonly interaction: CommandInteraction<TextableChannel> | undefined;
  private responses: InteractionContent[] = [];

  constructor(interaction: CommandInteraction<TextableChannel> | undefined) {
    this.interaction = interaction;
  }

  public async send(
    content: InteractionContent
  ): Promise<Message<TextableChannel> | undefined> {
    this.responses.push(content);

    if (!this.interaction) return;

    const message = await this.interaction.createFollowup(content);
    return message;
  }

  public getInitialResponse(): InteractionContent | undefined {
    return this.responses[0];
  }
}
