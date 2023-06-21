import { Blueprint } from "@entities/Blueprint";

export type BlueprintDto = Pick<Blueprint, "name" | "description" | "color">;
