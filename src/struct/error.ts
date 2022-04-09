import { Components } from "petal";

export class BotError extends Error {
  components: Components = [];
  name = "BotError";
  constructor(message: string, components?: Components) {
    super(message);
    this.components = components || [];
  }
}

export class UnexpectedError extends BotError {
  constructor() {
    super(
      "**an unexpected error occurred.**\nplease try again in a few moments."
    );
  }
}
