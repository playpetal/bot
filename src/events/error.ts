import { logger } from "../lib/logger";
import { Event } from "../struct/event";

const run = async function (e: Error) {
  logger.error(e);
};

export default new Event(["error"], run);
