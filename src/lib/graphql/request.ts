import { ApolloError } from "@apollo/client/core";
import { DocumentNode } from "graphql";
import { graphql } from ".";
import { BotError, UnexpectedError } from "../../struct/error";
import { logger } from "../logger";

type QueryVariables = Record<string, any>;

export async function query<T>({
  query,
  variables,
  authorization,
}: {
  query: DocumentNode;
  variables?: QueryVariables;
  authorization?: string;
}): Promise<T> {
  try {
    const result = await graphql.query({
      query,
      variables,
      context: { headers: { authorization } },
    });

    return result.data as T;
  } catch (e) {
    throw handle(e);
  }
}

export async function mutate<T>({
  operation,
  variables,
  authorization,
}: {
  operation: DocumentNode;
  variables?: QueryVariables;
  authorization?: string;
}): Promise<T> {
  try {
    const result = await graphql.mutate({
      mutation: operation,
      variables,
      context: { headers: { authorization } },
    });

    return result.data as T;
  } catch (e) {
    throw handle(e);
  }
}

function handle(error: unknown): Error {
  if (error instanceof ApolloError && error.graphQLErrors[0]) {
    const exception = error.graphQLErrors[0].extensions.exception as {
      isUserFacing: boolean | undefined;
      name: string;
    };

    const isUserFacing = exception.isUserFacing || false;

    if (isUserFacing)
      return new BotError(`**uh-oh!**\n${error.graphQLErrors[0].message}`);

    logger.error(error);
    return new UnexpectedError();
  } else {
    logger.error(error);
    return new UnexpectedError();
  }
}
