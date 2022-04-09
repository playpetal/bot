import { DocumentNode } from "graphql";
import { graphql } from ".";
import { BotError, UnexpectedError } from "../../struct/error";
import { logger } from "../logger";

export async function query<T>({
  query,
  variables,
  authorization,
}: {
  query: DocumentNode;
  variables?: { [key: string]: string | number | Date | undefined };
  authorization?: string;
}) {
  const result = await graphql.query({
    query,
    variables,
    context: { headers: { authorization } },
  });

  if (result.errors) {
    const exception = result.errors[0].extensions.exception as {
      isUserFacing: boolean | undefined;
      name: string;
    };
    const isUserFacing = exception.isUserFacing || false;

    if (isUserFacing)
      throw new BotError(`**uh-oh!**\n${result.errors[0].message}`);

    logger.error(result.errors);
    throw new UnexpectedError();
  }

  return result.data as T;
}
