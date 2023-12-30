import type { BundleBlueprint } from "./BundleBlueprint";
import type { IBundleDTO } from "@shared/types/dtos/Bundle";

export type Bundle = IBundleDTO & { blueprints: BundleBlueprint[] };
