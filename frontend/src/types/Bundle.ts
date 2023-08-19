import type { BundleBlueprint } from "./BundleBlueprint";
import type { IBundleDto } from "@shared/types/dtos/IBundleDto";

export type Bundle = IBundleDto & { blueprints: BundleBlueprint[] };
