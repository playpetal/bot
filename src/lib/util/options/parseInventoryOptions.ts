import {
  InventoryOrder,
  InventoryOrderOption,
  InventorySort,
  InventorySortOption,
} from "petal";
import { InteractionOptions } from "../../../struct/options";

const inventorySort: { [key in InventorySortOption]: InventorySort } = {
  issue: "ISSUE",
  code: "CODE",
  character: "CHARACTER",
  group: "GROUP",
  subgroup: "SUBGROUP",
  stage: "STAGE",
};

export function parseInventorySort(
  options: InteractionOptions
): InventorySort | undefined {
  const sort = options.getOption<InventorySortOption>("sort");

  if (!sort) return;

  return inventorySort[sort];
}

export function parseInventoryOrder(
  options: InteractionOptions
): InventoryOrder | undefined {
  const order = options.getOption<InventoryOrderOption>("order");

  if (!order) return;

  return order === "ascending" ? "ASC" : "DESC";
}
