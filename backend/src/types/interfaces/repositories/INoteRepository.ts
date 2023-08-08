import { Note } from "@entities/Note";
import { IBaseRepository } from "./IBaseRepository";

export interface INoteRepository extends IBaseRepository<Note> {}
