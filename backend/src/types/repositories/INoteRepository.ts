import { Note } from "@db/entities/Note";
import { IBaseRepository } from "./IBaseRepository";

export interface INoteRepository extends IBaseRepository<Note> {}
