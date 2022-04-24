import { gql } from "@apollo/client/core";
import { Product } from "petal";
import { query } from "../../request";

const operation = gql`
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
  const data = await query<{ products: Product[] }>({ query: operation });

  return data.products;
}
