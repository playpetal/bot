import { gql } from "@apollo/client/core";
import { Product } from "petal";
import { graphql, GraphQLResponse } from "../..";

const query = gql`
  query GetProducts {
    products {
      id
      name
      available
      price
    }
  }
`;

export async function getProducts(): Promise<Product[]> {
  const { data } = (await graphql.query({
    query,
  })) as GraphQLResponse<{
    products: Product[];
  }>;

  return data.products;
}
