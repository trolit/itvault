import { StorePaletteDto } from "@dtos/StorePaletteDto";
import { Palette } from "@entities/Bucket";
import { IBaseRepository } from "./IBaseRepository";

export interface IPaletteRepository extends IBaseRepository<Palette> {
  save(
    variantId: string,
    palettes: StorePaletteDto[]
  ): Promise<Palette[] | null>;
}
