import { Resource } from "@enums/Resource";

export class NoteDto {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly resource: Resource
  ) {}
}
