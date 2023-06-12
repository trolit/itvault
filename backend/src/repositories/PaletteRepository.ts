import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { Palette } from "@entities/Palette";
import { BaseRepository } from "./BaseRepository";
import { IPaletteRepository } from "@interfaces/repository/IPaletteRepository";

@injectable()
export class PaletteRepository
  extends BaseRepository<Palette>
  implements IPaletteRepository
{
  protected database: Repository<Palette>;

  constructor() {
    super(Palette);
  }
}
