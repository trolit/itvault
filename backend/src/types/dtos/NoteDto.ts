export enum Target {
  file,
}

export class NoteDto {
  constructor(
    readonly id: number,
    readonly text: string,
    readonly target: Target
  ) {}
}
