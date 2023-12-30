import type { BundleBlueprint } from "./BundleBlueprint";
import type { IBundleDTO } from "@shared/types/DTOs/Bundle";

export type Bundle = IBundleDTO & { blueprints: BundleBlueprint[] };
