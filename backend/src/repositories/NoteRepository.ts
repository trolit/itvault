import { injectable } from "tsyringe";
import { INoteRepository } from "types/repositories/INoteRepository";

import { BaseRepository } from "./BaseRepository";

import { Note } from "@entities/Note";

@injectable()
export class NoteRepository
  extends BaseRepository<Note>
  implements INoteRepository
{
  constructor() {
    super(Note);
  }
}
