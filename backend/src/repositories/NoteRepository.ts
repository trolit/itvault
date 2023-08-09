import { Repository } from "typeorm";
import { injectable } from "tsyringe";
import { INoteRepository } from "types/repositories/INoteRepository";

import { BaseRepository } from "./BaseRepository";

import { Note } from "@entities/Note";

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
