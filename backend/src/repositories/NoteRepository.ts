import { injectable } from "tsyringe";
import { Note } from "@db/entities/Note";
import { INoteRepository } from "types/repositories/INoteRepository";

import { BaseRepository } from "./BaseRepository";

@injectable()
export class NoteRepository
  extends BaseRepository<Note>
  implements INoteRepository
{
  constructor() {
    super(Note);
  }
}
