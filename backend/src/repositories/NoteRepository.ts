import { Repository } from "typeorm";
import { injectable } from "tsyringe";

import { BaseRepository } from "./BaseRepository";

import { Note } from "@entities/Note";
import { INoteRepository } from "@interfaces/repositories/INoteRepository";

@injectable()
export class NoteRepository
  extends BaseRepository<Note>
  implements INoteRepository
{
  protected database: Repository<Note>;

  constructor() {
    super(Note);
  }
}
