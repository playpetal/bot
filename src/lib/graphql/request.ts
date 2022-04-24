import { ApolloQueryResult, FetchResult } from "@apollo/client";
import { DocumentNode } from "graphql";
import { graphql } from ".";
import { BotError, UnexpectedError } from "../../struct/error";
import { logger } from "../logger";

type QueryVariables = {
  [key: string]: string | number | Date | undefined | null;
};

export async function query<T>({
  query,
  variables,
  authorization,
}: {
  query: DocumentNode;
  variables?: QueryVariables;
  authorization?: string;
}): Promise<T> {
  const result = await graphql.query({
    query,
    variables,
    context: { headers: { authorization } },
  });

  handleGraphQLErrors(result);

  return result.data as T;
}

export async function mutate<T>({
  operation,
  variables,
  authorization,
}: {
  operation: DocumentNode;
  variables: QueryVariables;
  authorization?: string;
}): Promise<T> {
  const result = await graphql.mutate({
    mutation: operation,
    variables,
    context: { headers: { authorization } },
  });

  handleGraphQLErrors(result);

  return result.data as T;
}

function handleGraphQLErrors(
  result: ApolloQueryResult<any> | FetchResult
): void {
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

  return;
}
