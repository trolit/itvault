import { Blueprint } from "@entities/Blueprint";

export type AddEditBlueprintDto = Pick<
  Blueprint,
  "name" | "description" | "color"
>;
