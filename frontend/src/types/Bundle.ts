import type { BundleBlueprint } from "./BundleBlueprint";
import type { IBundleDto } from "@shared/types/dtos/Bundle";

export type Bundle = IBundleDto & { blueprints: BundleBlueprint[] };
