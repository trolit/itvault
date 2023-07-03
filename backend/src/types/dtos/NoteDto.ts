export enum Resource {
  File = "File",
}

export class NoteDto {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly resource: Resource
  ) {}
}
