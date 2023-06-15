import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Palette } from "@entities/Palette";
import { BaseRepository } from "./BaseRepository";
import { IPaletteRepository } from "@interfaces/repository/IPaletteRepository";
import { StorePaletteDto } from "@dtos/StorePaletteDto";

@injectable()
export class PaletteRepository
  extends BaseRepository<Palette>
  implements IPaletteRepository
{
  protected database: Repository<Palette>;

  constructor() {
    super(Palette);
  }

  async save(
    variantId: string,
    palettesToAdd: StorePaletteDto[]
  ): Promise<Palette[] | null> {
    const transaction = await this.useTransaction();

    let palettes: Palette[] | null = null;

    try {
      await transaction.manager.delete(Palette, { variant: { id: variantId } });

      palettes = await transaction.manager.save(
        Palette,
        palettesToAdd.map(({ value, blueprintId }) => ({
          value,
          blueprint: { id: blueprintId },
          variant: { id: variantId },
        }))
      );

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
    } finally {
      await transaction.release();
    }

    return palettes;
  }
}
