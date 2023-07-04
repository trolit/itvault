import { CommentableResource } from "@enums/CommentableResource";

export class NoteDto {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly resource: CommentableResource
  ) {}
}
